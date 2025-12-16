import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { useAuthStore } from "../store/useAuthStore";
import { Phone, Video, X } from "lucide-react";
import toast from "react-hot-toast"; // Useful for notifications

const CallContainer = ({ targetUser, onClose, isIncomingCall }) => {
  const { authUser, socket } = useAuthStore();
  
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  
  // These track who we are talking to
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [idToCall, setIdToCall] = useState(""); 

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    // 1. Get Camera
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch(err => console.error("Error accessing media devices:", err));

    // 2. Identify who we are calling
    // If WE started the call, targetUser is set.
    if (targetUser) {
        setIdToCall(targetUser._id);
    }

    // 3. Handle Incoming Call Setup
    if (isIncomingCall) {
        setReceivingCall(true);
        setCaller(isIncomingCall.from);
        setCallerSignal(isIncomingCall.signal);
        // Important: If they called us, THEY are the "idToCall" for hanging up later
        setIdToCall(isIncomingCall.from); 
    }

    // 4. Listen for Remote Hang Up
    socket.on("callEnded", () => {
        setCallEnded(true);
        cleanupAndClose();
        toast.dismiss();
        toast.success("Call ended");
    });

    return () => {
        socket.off("callEnded");
    };
  }, [socket, isIncomingCall, targetUser]);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: authUser._id,
        name: authUser.fullName,
      });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    peer.on("error", (err) => {
        console.error("Peer error:", err);
        cleanupAndClose();
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    peer.on("error", (err) => {
        console.error("Peer error:", err);
        cleanupAndClose();
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  // --- NEW CLEANUP LOGIC ---
  const cleanupAndClose = () => {
    setCallEnded(true);
    
    // 1. Destroy the peer connection
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    
    // 2. Stop the camera (Crucial for allowing next call)
    if(stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    // 3. Close the modal
    onClose(); 
  };

  const leaveCall = () => {
    // 1. Tell the other person we are leaving
    // We send to 'idToCall' which is either targetUser._id OR caller
    if (idToCall) {
        socket.emit("endCall", { to: idToCall });
    }
    
    // 2. Clean up our side
    cleanupAndClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl p-4">
        {/* MY VIDEO */}
        <div className="relative bg-zinc-800 rounded-lg overflow-hidden aspect-video">
          <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover" />
          <p className="absolute bottom-2 left-2 bg-black/50 px-2 rounded">Me</p>
        </div>

        {/* THEIR VIDEO */}
        {callAccepted && !callEnded ? (
          <div className="relative bg-zinc-800 rounded-lg overflow-hidden aspect-video">
             <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
             <p className="absolute bottom-2 left-2 bg-black/50 px-2 rounded">Them</p>
          </div>
        ) : (
          <div className="flex items-center justify-center bg-zinc-800 rounded-lg aspect-video">
             <p className="text-zinc-500">
                {receivingCall ? "Incoming call..." : "Calling..."}
             </p>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-8">
        {/* IF RECEIVING CALL */}
        {receivingCall && !callAccepted ? (
           <div className="flex gap-4 items-center flex-col">
              <button onClick={answerCall} className="btn btn-success btn-circle btn-lg animate-bounce">
                <Phone className="text-white fill-current" />
              </button>
              <p>Answer</p>
           </div>
        ) : (
            <div className="flex gap-4">
                {/* START CALL BUTTON */}
                {!callAccepted && targetUser && (
                   <button onClick={() => callUser(targetUser._id)} className="btn btn-primary btn-wide">
                      Start Call
                   </button>
                )}
            </div>
        )}

        {/* HANG UP BUTTON */}
        <div className="flex gap-4 items-center flex-col">
            <button onClick={leaveCall} className="btn btn-error btn-circle btn-lg">
                <X className="text-white" />
            </button>
            <p>{receivingCall && !callAccepted ? "Decline" : "Hang Up"}</p>
        </div>
      </div>
    </div>
  );
};

export default CallContainer;
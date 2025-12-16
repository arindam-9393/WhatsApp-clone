import { X, Phone, Video } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";
import CallContainer from "./CallContainer";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, socket } = useAuthStore(); // <--- Get Socket here
  
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null); // <--- New State

  // LISTENER: Wait for calls anytime the header is visible
  useEffect(() => {
    if (!socket) return;

    socket.on("callUser", (data) => {
      // 1. Someone is calling!
      setIncomingCall(data);
      // 2. Open the window automatically
      setIsCallOpen(true);
    });

    return () => {
      socket.off("callUser");
    };
  }, [socket]);

  return (
    <>
      <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
              </div>
            </div>
            <div>
              <h3 className="font-medium">{selectedUser.fullName}</h3>
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
             <button onClick={() => setIsCallOpen(true)} className="btn btn-ghost btn-circle">
                <Video className="size-5" />
             </button>
             
             <button onClick={() => setIsCallOpen(true)} className="btn btn-ghost btn-circle">
                <Phone className="size-5" />
             </button>

             <button onClick={() => setSelectedUser(null)}>
                <X />
             </button>
          </div>
        </div>
      </div>

      {isCallOpen && (
         <CallContainer 
            targetUser={selectedUser} 
            isIncomingCall={incomingCall} // <--- Pass the call data down
            onClose={() => {
                setIsCallOpen(false);
                setIncomingCall(null);
            }} 
         />
      )}
    </>
  );
};
export default ChatHeader;
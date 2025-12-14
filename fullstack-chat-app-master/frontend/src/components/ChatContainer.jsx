import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Trash, Pencil, X, Check } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    deleteMessage,
    updateMessage,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const [zoomedImage, setZoomedImage] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleEditClick = (message) => {
    setEditingMessageId(message._id);
    setEditText(message.text);
  };

  const handleUpdate = async (messageId) => {
    if (editText.trim()) {
      await updateMessage(messageId, editText);
    }
    setEditingMessageId(null);
  };

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-[#0b141a]">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
            const isMyMessage = message.senderId === authUser._id;
            
            return (
              <div
                key={message._id}
                className={`chat ${isMyMessage ? "chat-end" : "chat-start"} group`}
                ref={messageEndRef}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border border-[#202c33]">
                    <img
                      src={
                        isMyMessage
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
                
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1 text-gray-400">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                
                <div className={`
                    chat-bubble flex flex-col relative group text-sm shadow-sm
                    ${isMyMessage 
                        ? "bg-[#005c4b] text-[#e9edef] rounded-tr-none"
                        : "bg-[#202c33] text-[#e9edef] rounded-tl-none"
                    }
                `}>
                  
                  {editingMessageId === message._id ? (
                     <div className="flex items-center gap-2">
                        <input 
                          className="input input-sm input-bordered w-full text-black min-w-[150px]"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          autoFocus
                        />
                        <button onClick={() => handleUpdate(message._id)} className="btn btn-xs btn-circle btn-success text-white">
                          <Check size={14} />
                        </button>
                        <button onClick={() => setEditingMessageId(null)} className="btn btn-xs btn-circle btn-ghost">
                          <X size={14} />
                        </button>
                     </div>
                  ) : (
                    <>
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setZoomedImage(message.image)}
                        />
                      )}
                      {message.text && <p className="leading-relaxed">{message.text}</p>}
                    </>
                  )}
    
                  {isMyMessage && editingMessageId !== message._id && (
                    <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       {message.text && (
                         <button 
                           onClick={() => handleEditClick(message)}
                           className="btn btn-xs btn-circle bg-[#202c33] hover:bg-[#2a3942] border-none text-gray-300"
                         >
                           <Pencil size={12} />
                         </button>
                       )}
                       <button 
                         onClick={() => deleteMessage(message._id)}
                         className="btn btn-xs btn-circle bg-[#202c33] hover:bg-red-900 border-none text-red-400"
                       >
                         <Trash size={12} />
                       </button>
                    </div>
                  )}
    
                </div>
              </div>
            )
        })}
      </div>

      <MessageInput />

      {zoomedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
             <button 
               className="absolute top-4 right-4 text-white hover:text-gray-300 btn btn-sm btn-circle btn-ghost"
               onClick={() => setZoomedImage(null)}
             >
               ✕
             </button>
             <img 
               src={zoomedImage} 
               alt="Full Size" 
               className="max-w-full max-h-full rounded-lg object-contain" 
             />
          </div>
        </div>
      )}

    </div>
  );
};
export default ChatContainer;
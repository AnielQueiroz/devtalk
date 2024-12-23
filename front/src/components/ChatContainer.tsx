import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore"
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/util";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } = useChatStore();
  const { authUser } = useAuthStore(); 
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser._id);
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [selectedUser?._id, getMessages])

  useEffect(() => {
    // Ignorar aviso de linting para incluir messages nas dependências
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) return (
    <div className="h-full flex flex-col">
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      <ChatHeader />

      <div className="overflow-y-auto flex-1 p-4 space-y-4 bg-base-100">
        {messages.map((msg) => (
          <div key={msg._id} className={`chat ${msg.senderId === authUser?._id ? "chat-end" : "chat-start"}`}>
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img 
                  src={msg.senderId === authUser?._id ? authUser?.profilePic || "/avatar.png" : selectedUser?.profilePic || "/avatar.png"} 
                  alt={msg.senderId === authUser?._id ? "Your profile picture" : `${selectedUser?.fullName}'s profile picture`} 
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {msg.createdAt && formatMessageTime(new Date(msg.createdAt))}
              </time>
            </div>
            <div className={`chat-bubble flex flex-col ${msg.senderId === authUser?._id ? "bg-primary text-primary-content" : "bg-secondary text-secondary-content"}`}>
              {msg.image && (
                <img src={msg.image as string} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2" />
              )}
                {msg.text && <p>{msg.text}</p>}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer
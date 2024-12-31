import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/util";
import { X } from "lucide-react";
import { t } from "i18next";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser._id);

  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    // Ignorar aviso de linting para incluir messages nas dependências
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading)
    return (
      <div className="h-full absolute w-full md:static left-0 top-0 flex flex-col z-[800]">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  const showImgBigger = (img: string) => {
    setSelectedImg(img);
  };

  return (
    <div className="h-full absolute w-full md:static left-0 top-0 flex flex-col z-[800]">
      {selectedImg && (
        <div
          className="fixed inset-0 bg-neutral bg-opacity-75 flex justify-center items-center z-50"
          onClick={() => setSelectedImg(null)}
          onKeyUp={() => setSelectedImg(null)}
          onKeyDown={() => setSelectedImg(null)}
          onKeyPress={() => setSelectedImg(null)}
        >
          <div className="max-w-3xl max-h-[90%] overflow-auto">
            <img src={selectedImg} alt="Expanded Attachment" className="w-full h-auto rounded-md" />
          </div>
          <button type="button" className="absolute bg-primary rounded-lg p-2 hover:opacity-80 top-4 right-4 text-white text-2xl" onClick={() => setSelectedImg(null)}><X /></button>
        </div>
      )}
      
      <ChatHeader />

      <div className="overflow-y-auto flex-1 p-4 space-y-4 bg-base-100">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`chat ${
              msg.senderId === authUser?._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    msg.senderId === authUser?._id
                      ? authUser?.profilePic || "/avatar.png"
                      : selectedUser?.profilePic || "/avatar.png"
                  }
                  alt={
                    msg.senderId === authUser?._id
                      ? "Your profile picture"
                      : `${selectedUser?.fullName}'s profile picture`
                  }
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {msg.createdAt && formatMessageTime(new Date(msg.createdAt))}
              </time>
            </div>
            <div
              className={`chat-bubble flex flex-col ${
                msg.senderId === authUser?._id
                  ? "bg-primary text-primary-content"
                  : "bg-secondary text-secondary-content"
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image as string}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer hover:opacity-90"
                  onClick={() => showImgBigger(msg.image as string)}
                  onKeyUp={() => showImgBigger(msg.image as string)}
                  onKeyDown={() => showImgBigger(msg.image as string)}
                  onKeyPress={() => showImgBigger(msg.image as string)}
                />
              )}
              {msg.text && <p>{msg.text}</p>}
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-4">{t('startChat')}</h2>
            <p className="text-zinc-500 text-center">
              {t('sendAMsgToStart')} {selectedUser?.fullName}.
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;

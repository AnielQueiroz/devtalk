import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

interface ChatHeaderProps {
  title: string;
  type: "user" | "community";
  desc?: string;
}

const ChatHeader = ({ title, type, desc }: ChatHeaderProps) => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b bg-base-200 border-primary/30 z-[800] md:z-0 shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser?.profilePic || "/avatar.png"}
                alt={selectedUser?.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-base-content/70">
              {type === "user" ? onlineUsers.includes(selectedUser?._id as string) ? "Online" : "Offline" : desc}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button type="button" onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;

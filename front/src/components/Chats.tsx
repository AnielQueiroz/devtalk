import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { t } from "i18next";
import { useAuthStore } from "../store/useAuthStore";

const Chats = () => {
  const {
    getInteractedUsers,
    users,
    selectedUser,
    setSelectedUser,
    setSelectedCommunity,
    isUsersLoading,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const  [showOnlineOnly, setShowOnlineOnlineOnly] = useState(false);

  useEffect(() => {
    getInteractedUsers();
  }, [getInteractedUsers]);

  const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id as string)) : users;

  return (
    <>
      {isUsersLoading ? (
        <SidebarSkeleton />
      ) : (
        <div className="w-full h-full flex flex-col">
          {/* titulo */}
          <div className="flex items-center justify-center gap-2 py-[18px] border-b border-primary/30 shrink-0">
            <Users className="size-6" />
            <h1 className="text-lg font-bold">{t("chats")}</h1>
          </div>
          <div className="mt-3 flex justify-between p-2 items-center gap-2">
            <label htmlFor="showOnlineOnly" className="cursor-pointer flex items-center gap-2">
              <input id="showOnlineOnly" type="checkbox" checked={showOnlineOnly} onChange={(e) => setShowOnlineOnlineOnly(e.target.checked)} className="checkbox checkbox-sm" />
              <span className="text-sm">{t('showOnlineOnly')}</span> 
            </label>
            <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
          </div>
          <div className="flex-1 overflow-y-auto py-3">
            {filteredUsers.map((user) => (
              <button
                type="button"
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                  setSelectedCommunity(null);
                }}
                className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }`}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="rounded-full size-12 object-cover"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                  )}
                </div>

                <div className="flex-1 md:block text-left min-w-0">
                  <div className="font-medium truncate">{user.fullName}</div>
                  <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center text-zinc-500 py-4">{t('noUsersOnline')}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chats;

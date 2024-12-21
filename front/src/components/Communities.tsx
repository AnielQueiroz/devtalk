import { t } from "i18next";
import { Group } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const Communities = () => {
  const { selectedCommunity, setSelectedCommunity, setSelectedUser } = useChatStore();

  const communities = [
    { id: 1, name: "Comunidade React" },
    { id: 2, name: "Comunidade Node.js" },
  ];

  return (
    <div className="overflow-y-auto w-full py-3">
      {/* titulo */}
      <div className="flex items-center justify-center gap-2 p-3 border-b border-base-300">
        <Group className="size-6" />
        <h1 className="text-lg font-bold">{t("communities")}</h1>
      </div>

      {communities.map((community) => (
        <button
          type="button"
          key={community.id}
          onClick={() => {
            setSelectedCommunity(community);
            setSelectedUser(null);
          }}
          className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
            selectedCommunity?.id === community.id ? "bg-base-300 ring-1 ring-base-300" : ""
          }`}
        >
          <div className="relative mx-auto lg:mx-0">
            <div className="skeleton size-12 rounded-full" />
          </div>

          <div className="hidden lg:block text-left min-w-0">
            <div className="font-medium truncate">{community.name}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default Communities;

import { t } from "i18next";
import { Group, MessageCircle } from "lucide-react";
import { useState } from "react";
import Chats from "../components/Chats";
import Communities from "../components/Communities";
import { useChatStore } from "../store/useChatStore";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import CommunityContainer from "../components/CommunityContainer";

const HomePage = () => {
  const [selectedMenu, setSelectedMenu] = useState("contacts");
  const { selectedUser, selectedCommunity } = useChatStore();

  const handleMenuSelect = (menu: string) => {
    setSelectedMenu(menu);
  };

  return (
    <div className="h-screen flex pt-28 sm:pt-16 bg-base-200">
      {/* ASIDE MENU */}
      <aside className="border-r border-base-300 flex transition-all duration-200">
        <ul className="menu bg-base-300">
          <li>
            <button
              type="button"
              className={`tooltip tooltip-right ${
                selectedMenu === "contacts" ? "bg-primary/75" : ""
              }`}
              data-tip={t("chats")}
              onClick={() => handleMenuSelect("contacts")}
            >
              <MessageCircle className="size-6" />
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`tooltip tooltip-right ${
                selectedMenu === "communities" ? "bg-primary/75" : ""
              }`}
              data-tip={t("communities")}
              onClick={() => handleMenuSelect("communities")}
            >
              <Group className="size-6" />
            </button>
          </li>
        </ul>
      </aside>

      <div className="h-full w-full md:w-72 lg:w-96">
        {selectedMenu === "contacts" && <Chats />}
        {selectedMenu === "communities" && <Communities />}
      </div>

      {/* Area principal */}
      <div className="flex-1">
        {selectedUser ? (
          <ChatContainer />
        ) : selectedCommunity ? (
          <CommunityContainer />
        ) : (
          <NoChatSelected />
        )}
      </div>
    </div>
  );
};

export default HomePage;

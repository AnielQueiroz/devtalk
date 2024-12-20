import { useState, useEffect, type SetStateAction } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Group, MessageCircle, Users } from "lucide-react";
import { t } from "i18next";
import { useChatStore } from "../store/useChatStore";

const Sidebar = () => {
	const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, setSelectedCommunity } =
		useChatStore();
	const [selectedMenu, setSelectedMenu] = useState("contacts");

	useEffect(() => {
		getUsers();
	}, [getUsers]);

	// Exemplo de comunidades
	const communities = [
		{ id: 1, name: "Comunidade 1" },
		{ id: 2, name: "Comunidade 2" },
		{ id: 3, name: "Comunidade 3" },
	];

	const onlineUsers: string | string[] = [];

	// Função para alternar o menu
	const handleMenuSelect = (menu: SetStateAction<string>) => {
		setSelectedMenu(menu);
	};

    const setNullState = (selected: string) => {
        if (selected === "contacts") {
            setSelectedCommunity(null);
        } else {
            setSelectedUser(null);
        }
    }

	return (
		<aside className="h-full lg:w-72 border-r border-base-300 flex transition-all duration-200">
			{/* Div vertical para os menus */}
			<ul className="menu bg-base-300">
				<li>
					<button
						type="button"
						className="tooltip tooltip-right"
						data-tip="Contatos"
						onClick={() => handleMenuSelect("contacts")}
					>
						<MessageCircle className="size-6" />
					</button>
				</li>
				<li>
					<button
						type="button"
						className="tooltip tooltip-right"
						data-tip="Comunidades"
						onClick={() => handleMenuSelect("communities")}
					>
						<Group className="size-6" />
					</button>
				</li>
			</ul>

			{/* Div dos conteúdos escolhidos no menu */}
			<div className="h-full w-full flex flex-col">
				<div className="border-b border-base-300 w-full p-5">
					{/* Ícone e texto do menu */}
					{selectedMenu === "contacts" && (
						<div className="flex items-center justify-center gap-2">
							<Users className="size-6" />
							<span className="font-medium hidden lg:block">
								{t("contacts")}
							</span>
						</div>
					)}
					{selectedMenu === "communities" && (
						<div className="flex items-center justify-center gap-2">
							<Group className="size-6" />
							<span className="font-medium hidden lg:block">
								{t("communities")}
							</span>
						</div>
					)}
				</div>

				<div className="overflow-y-auto w-full py-3">
					{/* Renderizar Contatos */}
					{selectedMenu === "contacts" && isUsersLoading ? (
						<SidebarSkeleton />
					) : (
						selectedMenu === "contacts" &&
						users.map((user) => (
							<button
								type="button"
								key={user._id}
								onClick={() => {
                                    setSelectedUser(user);
                                    setNullState('communities');
                                }}
								className={`w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-colors ${selectedUser?._id === user._id ? "bg-base-200 ring-1 ring-base-200" : ""}`}
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

								<div className="hidden lg:block text-left min-w-0">
									<div className="font-medium truncate">{user.fullName}</div>
									<div className="text-sm text-zinc-400">
										{onlineUsers.includes(user._id) ? "Online" : "Offline"}
									</div>
								</div>
							</button>
						))
					)}

					{/* Renderizar Comunidades */}
					{selectedMenu === "communities" &&
						communities.map((community) => (
							<button
								type="button"
								key={community.id}
                                onClick={() => {
                                    setSelectedCommunity(community);
                                    setNullState('contacts');
                                }}
								className="w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-colors"
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
			</div>
		</aside>
	);
};

export default Sidebar;

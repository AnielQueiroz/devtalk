import { t } from "i18next";
import { Plus, Users } from "lucide-react";
import { useCommunityStore } from "../store/useCommunityStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import TitleMenuAside from "./TitleMenuAside";
import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

const Communities = () => {
	const {
		communities,
		unreadCommunityCounts,
		isCommunitiesLoading,
		selectedCommunity,
		setSelectedCommunity,
		getMyCommunities,
	} = useCommunityStore();

	const { setSelectedUser } = useChatStore();

	useEffect(() => {
		getMyCommunities();
	}, [getMyCommunities]);

	if (communities && communities.length === 0) {
		return (
			<div className="w-full h-full flex flex-col">
				{/* Título fixo */}
				<TitleMenuAside
					icon={<Users className="size-6" />}
					title="communities"
				/>

				<div className="flex flex-1 p-4 items-center justify-center">
					<p className="text-center text-sm text-base-content/60">
						{t("noCommunitiesHere")}
					</p>
				</div>

				{/* Botão fixo flutuante */}
				<div className="relative bottom-4 right-[-20rem] z-9">
					<button
						type="button"
						className="btn btn-primary rounded-lg"
						onClick={() => console.log("Criar comunidade")}
						title="Criar comunidade"
					>
						<Plus className="size-4" />
					</button>
				</div>
			</div>
		);
	};

	return (
		<>
			{isCommunitiesLoading ? (
				<SidebarSkeleton />
			) : (
				<div className="w-full h-full flex flex-col">
					{/* Título fixo */}
					<TitleMenuAside
						icon={<Users className="size-6" />}
						title="communities"
					/>

					{/* Conteúdo com scroll */}
					<div className="flex-1 overflow-y-auto py-3">
						{Array.isArray(communities) && communities.map((community) => (
							<button
								type="button"
								key={community._id}
								onClick={() => {
									setSelectedCommunity(community);
									setSelectedUser(null);
								}}
								className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
									selectedCommunity?._id === community._id
										? "bg-base-300 ring-1 ring-base-300"
										: ""
								}`}
							>
								<div className="relative mx-auto lg:mx-0">
									<img
										src={community.photoUrl || "/users.png"}
										alt={community.name}
										className="w-12 h-12 object-cover rounded-full"
									/>
								</div>

								<div className="flex-1 md:block text-left min-w-0">
									<div className="font-medium truncate">{community.name}</div>
									<div className="text-sm text-zinc-400">{community.description}</div>
								
								</div>

								{unreadCommunityCounts[community._id] > 0 && (
									<div className="bg-primary text-sm text-white rounded-full w-6 h-6 flex items-center justify-center">
										{unreadCommunityCounts[community._id]}
								  </div>
								)}
							</button>
						))}
					</div>

					{/* Botão fixo flutuante */}
					<div className="relative bottom-4 right-[-20rem] z-9">
						<button
							type="button"
							className="btn btn-primary rounded-lg"
							onClick={() => console.log("Criar comunidade")}
							title="Criar comunidade"
						>
							<Plus className="size-4" />
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default Communities;

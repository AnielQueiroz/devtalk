import { t } from "i18next";
import { Plus, Users } from "lucide-react";
import { useCommunityStore } from "../store/useCommunityStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import TitleMenuAside from "./TitleMenuAside";
import { useEffect } from "react";

const Communities = () => {
	const {
		communities,
		isCommunitiesLoading,
		selectedCommunity,
		setSelectedCommunity,
		getMyCommunities,
	} = useCommunityStore();

	useEffect(() => {
		getMyCommunities();
	}, [getMyCommunities]);

	if (communities.length === 0) {
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
				<div className="relative bottom-4 right-[-20rem] z-50">
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
	}

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
						{communities.map((community) => (
							<button
								type="button"
								key={community._id}
								onClick={() => {
									setSelectedCommunity(community);
								}}
								className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
									selectedCommunity?._id === community._id
										? "bg-base-300 ring-1 ring-base-300"
										: ""
								}`}
							>
								<div className="relative mx-auto lg:mx-0">
									<img
										src={community.photoUrl || "/avatar.png"}
										alt={community.name}
										className="w-12 h-12 object-cover rounded-full"
									/>
								</div>

								<div className="hidden lg:block text-left min-w-0">
									<div className="font-medium truncate">{community.name}</div>
								</div>
							</button>
						))}
					</div>

					{/* Botão fixo flutuante */}
					{/* <div className="relative bottom-4 right-[-20rem] z-50">
						<button
							type="button"
							className="btn btn-primary rounded-lg"
							onClick={() => console.log("Criar comunidade")}
							title="Criar comunidade"
						>
							<Plus className="size-4" />
						</button>
					</div> */}
				</div>
			)}
		</>
	);
};

export default Communities;

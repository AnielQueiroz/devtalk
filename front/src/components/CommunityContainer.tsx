import { useEffect, useRef } from "react";
import { useCommunityStore } from "../store/useCommunityStore";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime, isCodeMessage } from "../lib/util";
import { t } from "i18next";
import Loading from "./Loading";

const CommunityContainer = () => {
	const {
		selectedCommunity,
		getCommunityMessages,
		isMessagesLoading,
		communityMessages,
		joinCommunity,
		requestTojoinCommunity,
		isJoining,
		getMyCommunities,
		hasJoined,
	} = useCommunityStore();

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { authUser, checkAuth } = useAuthStore();

	useEffect(() => {
		if (
			selectedCommunity?._id &&
			(IBelongToThisCommunity() || isPublicToJoin())
		)
			getCommunityMessages(selectedCommunity._id);
	}, [selectedCommunity?._id, getCommunityMessages]);

	useEffect(() => {
		if (messagesEndRef.current && communityMessages.length > 0) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	});

	// Verifica se o usuário pertence à comunidade
	const IBelongToThisCommunity = () => {
		if (selectedCommunity) {
			return authUser?.joinedCommunities.some(
				(id) => id.toString() === selectedCommunity?._id,
			);
		}
		return false;
	};

	// Verifica se a comunidade é publica
	const isPublicToJoin = () => {
		if (selectedCommunity) {
			return selectedCommunity?.isPublic;
		}
		return false;
	};

	const handleJoinCommunity = async (communityId: string) => {
		if (communityId) {
			await joinCommunity(communityId);
			checkAuth();
			getMyCommunities();
		}
	};

	// Caso esteja carregando as mensagens
	if (isMessagesLoading) {
		return (
			<div className="h-full absolute w-full md:static left-0 top-0 flex flex-col z-[800]">
				<ChatHeader
					type="community"
					title={selectedCommunity?.name as string}
					desc={selectedCommunity?.description}
				/>
				<MessageSkeleton />
				<MessageInput type="community" />
			</div>
		);
	}

	// Caso a comunidade seja privada e o usuário não pertencer à comunidade
	if (!IBelongToThisCommunity() && !isPublicToJoin()) {
		return (
			<div className="h-full absolute w-full md:static left-0 top-0 flex flex-col z-[800]">
				<ChatHeader
					type="community"
					desc={selectedCommunity?.description}
					title={selectedCommunity?.name || ""}
				/>

				<div className="relative flex-1 overflow-hidden">
					<MessageSkeleton />
					<div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-10 opacity-80">
						<div className="bg-white p-6 rounded-lg shadow-md text-center">
							<h2 className="text-primary text-2xl font-bold mb-2">
								{t("privateCommunity")}
							</h2>
							<p className="text-zinc-600 mb-4">{t("accessDeniedCommunity")}</p>
							{authUser?.pendingCommunities.includes(
								selectedCommunity?._id as string,
							) ? (
								<>
									<p className="text-zinc-600 mb-4">{t("waitingApproval")}</p>
									<Loading color="primary" />
								</>
							) : (
								<button
									type="button"
									className="btn btn-primary"
									onClick={() =>
										requestTojoinCommunity(selectedCommunity?._id as string)
									}
								>
									{isJoining ? <Loading /> : t("requestToJoin")}
								</button>
							)}
						</div>
					</div>
				</div>

				{/* <div className="p-4 w-full bg-base-200 z-10">
					<div className="flex justify-between items-center gap-2">
						<p className="text-base text-zinc-600">{t("requestToJoin")}</p>
						<button
							type="button"
							className="btn btn-primary"
							onClick={() => joinCommunity(selectedCommunity?._id as string)}
						>
							{t("requestHere")}
						</button>
					</div>
				</div> */}
			</div>
		);
	}

	return (
		<div className="h-full absolute w-full md:static left-0 top-0 flex flex-col z-[800]">
			<ChatHeader
				type="community"
				desc={selectedCommunity?.description}
				title={selectedCommunity?.name || ""}
			/>

			<div className="overflow-y-auto flex-1 content-end p-4 space-y-4 bg-base-100">
				{communityMessages.map((msg) => (
					<div
						key={msg._id}
						className={`chat ${
							msg.senderId._id === authUser?._id ? "chat-end" : "chat-start"
						}`}
					>
						{/* Avatar */}
						<div className="chat-image avatar">
							{msg.senderId.profilePic ? (
								<div className="size-10 rounded-full border">
									<img
										src={msg.senderId.profilePic || "/avatar.png"}
										alt={
											msg.senderId._id === authUser?._id
												? "Your profile picture"
												: `${msg.senderId.fullName}'s profile picture`
										}
									/>
								</div>
							) : (
								<div className="avatar placeholder">
									<div className="bg-neutral text-neutral-content size-10 rounded-full">
										<span className="text-sm">
											{msg.senderId.fullName.slice(0, 2).toLocaleUpperCase()}
										</span>
									</div>
								</div>
							)}
						</div>
						<div className="chat-header flex items-baseline mb-1">
							<h4 className="font-bold">
								{msg.senderId._id === authUser?._id
									? t("you")
									: msg.senderId.fullName}
							</h4>
							<time className="text-xs opacity-50 ml-1">
								{msg.createdAt && formatMessageTime(new Date(msg.createdAt))}
							</time>
						</div>
						<div
							className={`chat-bubble flex flex-col max-w-[50%] ${
								msg.senderId._id === authUser?._id
									? "bg-primary text-primary-content"
									: "bg-secondary text-secondary-content"
							}`}
						>
							{msg.image && (
								<img
									src={msg.image}
									alt="Attachment"
									className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer hover:opacity-90"
								/>
							)}
							{msg.text && (
								<div
									className={`${isCodeMessage(msg.text) ? "mockup-code font-serif opacity-90" : ""} whitespace-pre-wrap`}
								>
									{isCodeMessage(msg.text)
										? msg.text
												.trim()
												.split("\n")
												.map((line) => (
													<pre key={Math.random()}>
														<code>{line}</code>
													</pre>
												))
										: msg.text.split("\n").map((line) => (
												<span key={Math.random()}>
													{line}
													<br />
												</span>
											))}
								</div>
							)}
						</div>
					</div>
				))}

				<div ref={messagesEndRef} />

				{communityMessages.length === 0 && (
					<div className="flex flex-col items-center justify-center h-full">
						<h2 className="text-2xl font-bold mb-4">{t("startChat")}</h2>
						<p className="text-zinc-500 text-center">
							{t("sendAMsgToStart")} {selectedCommunity?.name}.
						</p>
					</div>
				)}
			</div>

			{isPublicToJoin() && !IBelongToThisCommunity() && !hasJoined ? (
				<div className="p-4 w-full flex justify-between items-center bg-base-200 z-10 border-top border-base-300">
					<p className="text-base text-zinc-600">{t("becomeAMemberToType")}</p>
					<button
						type="button"
						className="btn btn-primary"
						onClick={() =>
							handleJoinCommunity(selectedCommunity?._id as string)
						}
					>
						{isJoining ? <Loading /> : t("enter")}
					</button>
				</div>
			) : (
				<MessageInput type="community" />
			)}
		</div>
	);
};

export default CommunityContainer;

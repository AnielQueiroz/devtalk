import { useEffect, useRef } from "react";
import { useCommunityStore } from "../store/useCommunityStore";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime, isCodeMessage } from "../lib/util";
import { t } from "i18next";

const CommunityContainer = () => {
	const {
		selectedCommunity,
		getCommunityMessages,
		isMessagesLoading,
		communityMessages,
	} = useCommunityStore();
	// const messagesEndRef = useRef<HTMLDivElement>(null);
	const { authUser } = useAuthStore();

	useEffect(() => {
		if (selectedCommunity?._id) getCommunityMessages(selectedCommunity._id);
	}, [selectedCommunity?._id, getCommunityMessages]);

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

				{communityMessages.length === 0 && (
					<div className="flex flex-col items-center justify-center h-full">
						<h2 className="text-2xl font-bold mb-4">{t("startChat")}</h2>
						<p className="text-zinc-500 text-center">
							{t("sendAMsgToStart")} {selectedCommunity?.name}.
						</p>
					</div>
				)}
			</div>

			<MessageInput type="community" />
		</div>
	);
};

export default CommunityContainer;

import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useAuthStore } from "./useAuthStore";

interface Community {
    _id: string;
    isPublic: boolean;
    name: string;
    description?: string | undefined;
    photoUrl?: string | undefined;
    tags: Record<string, string>[] | undefined;
    creatorId: Record<string, string>;
    createdAt: string;
};

interface Message {
    _id: string;
    senderId: {
        _id: string;
        fullName: string;
        profilePic: string;
    };
    communityId: string;
    text: string | null;
    image: string | null;
    isReadBy: [{
        _id: string;
        readAt: string;
        isRead: boolean;
        userId: string;
    }];
    createdAt: string;
    updatedAt: string;
}

interface SendMsgProps {
    text?: string | null;
    image?: string | ArrayBuffer | null;
}

interface CommunityStoreState {
    communities: Community[] | [];
    communitySearchResults: Community[] | [];
    communityMessages: Message[];
    unreadCommunityCounts: Record<string, number>;
    selectedCommunity: Community | null;
    isCommunitiesLoading: boolean;
    isMessagesLoading: boolean;
    isJoining: boolean;
    hasJoined: boolean;
    setSelectedCommunity: (community: Community | null) => void;
    setCommunities: (communities: Community[] | undefined) => void;
    setCommunitySearchResults: (communities: Community[] | undefined) => void;
    subscribeToCommunityMessages: () => void;
    unsubscribeToCommunityMessages: () => void;
    getCommunities: (query: string) => Promise<void>;
    getCommunity: (id: number) => Promise<void>;
    getMyCommunities: () => Promise<void>;
    getCommunityMessages: (id: string) => Promise<void>;
    sendCommunityMessages: ({ image, text }: { image: string | ArrayBuffer | null; text: string | null; }) => Promise<void>;
    joinCommunity: (communityId: string) => Promise<void>;
    requestTojoinCommunity: (communityId: string) => Promise<void>;
}

export const useCommunityStore = create<CommunityStoreState>((set, get) => ({
    communities: [],
    communitySearchResults: [],
    communityMessages: [],
    unreadCommunityCounts: {},
    selectedCommunity: null,
    isCommunitiesLoading: false,
    isMessagesLoading: false,
    isJoining: false,
    hasJoined: false,

    getCommunities: async (query: string) => {
        set({ isCommunitiesLoading: true });
        try {
            const res =  await axiosInstance.get(`/community/search?name=${query}&tagName=${query}`);
            set({ communitySearchResults: res.data.communities });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            toast.error("Oops! Something went wrong. Try again later!");
        } finally {
            set({ isCommunitiesLoading: false });
        }
    },

    getMyCommunities: async () => {
        set({ isCommunitiesLoading: true });
        try {
            const res = await axiosInstance.get("/community/my-communities");
            set({ communities: res.data });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            toast.error("Oops! Something went wrong. Try again later!");
        } finally {
            set({ isCommunitiesLoading: false });
        }
    },

    getCommunityMessages: async (id: string) => {
        const PAGE = 1;
        const LIMIT = 30;
        
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/community/${id}/messages?page=${PAGE}&limit=${LIMIT}`);
            set({ communityMessages: res.data.messages.reverse() });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            toast.error("Oops! Something went wrong. Try again later!");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendCommunityMessages: async ({ image, text }: SendMsgProps) => {
        const { selectedCommunity, communityMessages} = get();
        const me = useAuthStore.getState().authUser;

        if (!selectedCommunity) return;

        try {
            const res = await axiosInstance(`community/send-message/${selectedCommunity?._id}`, {
                method: "POST",
                data: { image, text },
            });
            const messageWithMySender = { ...res.data.newMessage, senderId: { _id: me?._id, fullName: me?.fullName, profilePic: me?.profilePic } };
            set({ communityMessages: [...communityMessages || [], messageWithMySender] });
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            toast.error("Oops! Something went wrong. Try again later!");
        }
    },

    getCommunity: async (id: number) => {
        console.log(id);
    },

    setSelectedCommunity: (community: Community | null) => set({ selectedCommunity: community }),
    
    setCommunities: (communities: Community[] | undefined) => set({ communities }),

    setCommunitySearchResults: (communities: Community[] | undefined) => set({ communitySearchResults: communities }),

    subscribeToCommunityMessages: () => {
        const socket = useAuthStore.getState().socket;
        const user = useAuthStore.getState().authUser;

        if (!socket) return console.error('Socket não está disponível!');
        if (!user) return console.error('Usuário não está disponível!');

        // Entrar nas salas das comunidades do usuario
        if (user.joinedCommunities && user.joinedCommunities.length > 0) {
            for (const communityId of user.joinedCommunities) {
                socket.emit('joinCommunity', communityId);
            }
        };

        // Remover listerner anterior para evitar duplicidade
        socket.off("newCommunityMessage");

        // Escutar as mensagens das comunidades
        socket.on("newCommunityMessage", (data) => {
            const newMessage = data.newMessage;
            const { communityMessages, selectedCommunity, unreadCommunityCounts } = get();

            if (newMessage.communityId._id === selectedCommunity?._id) {
                set({ communityMessages: [...communityMessages || [], newMessage] });    
            } else {
                const communityId = newMessage.communityId._id;
                set({
                    unreadCommunityCounts: {
                        ...unreadCommunityCounts,
                        [communityId]: (unreadCommunityCounts[communityId] || 0) + 1
                    },
                });

                // Notificar no navegador menos se eu for o sender
                if (newMessage.senderId._id !== user._id) {
                    if (Notification.permission === "granted") {
                        new Notification(newMessage.communityId.name, {
                            body: newMessage.text, // Exibe o texto da mensagem
                            icon: newMessage.profilePic, // Ícone opcional
                        });
                    }

                    const audio = new Audio("/sounds/community_notification.mp3");
					audio.play().catch(() => console.error("Erro ao tocar o som"));
                }
            }
        });
    },

    unsubscribeToCommunityMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return console.error('Socket não está disponível!');
        socket.off("newCommunityMessage");
    },
    
    joinCommunity: async (communityId: string) => {
        if (!communityId) return;

        set({ isJoining: true });
        try {
            const res = await axiosInstance.post(`community/join/${communityId}`);
            toast.success(res.data.message);
            set({ hasJoined: true });
        } catch (error) {
            set({ hasJoined: false})
            console.log(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            toast.error("Oops! Something went wrong. Try again later!");
        } finally {
            set({ isJoining: false });
        }
    },

    requestTojoinCommunity: async (communityId: string) => {
        if (!communityId) return;

        set({ isJoining: true });
        try {
            const res = await axiosInstance.post(`community/join-request/${communityId}`);
            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            // toast.error("Oops! Something went wrong. Try again later!");
        } finally {
            set({ isJoining: false });
        }
    },
}));

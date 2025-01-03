import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface Community {
    _id: string;
    isPublic: boolean;
    name: string;
    description: string;
    photoUrl: string;
    tags: Record<string, string>[];
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

interface CommunityStoreState {
    communities: Community[];
    communityMessages: Message[];
    selectedCommunity: Community | null;
    isCommunitiesLoading: boolean;
    isMessagesLoading: boolean;
    setSelectedCommunity: (community: Community | null) => void;
    getCommunities: (query: string) => Promise<void>;
    getCommunity: (id: number) => Promise<void>;
    getMyCommunities: () => Promise<void>;
    getCommunityMessages: (id: string) => Promise<void>;
}

export const useCommunityStore = create<CommunityStoreState>((set, get) => ({
    communities: [],
    communityMessages: [],
    selectedCommunity: null,
    isCommunitiesLoading: false,
    isMessagesLoading: false,

    getCommunities: async (query: string) => {
        set({ isCommunitiesLoading: true });
        try {
            const res =  await axiosInstance.get(`/community/search?query=${query}`);
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
        const LIMIT = 10;
        
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/community/${id}/messages?page=${PAGE}&limit=${LIMIT}`);
            set({ communityMessages: res.data.messages });
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

    getCommunity: async (id: number) => {},

    setSelectedCommunity: (community: Community | null) => set({ selectedCommunity: community }),
}));
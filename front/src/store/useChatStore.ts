import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { AxiosError } from 'axios';
import { useAuthStore } from './useAuthStore';

interface User {
    _id: string;
    fullName: string;
    email: string;
    profilePic?: string;
}

interface Community {
    id: number;
    name: string;
}

interface Messages {
    _id?: string;
    senderId?: string;
    receiverId?: string;
    text?: string;
    image?: string | ArrayBuffer | null;
    createdAt?: string;
    updatedAt?: string;
}

interface ChatStoreState {
    messages: Messages[];
    users: User[];
    searchResults: {
        users: User[];
        communities: Community[];
    } | null;
    selectedUser: User | null;
    selectedCommunity: Community | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    isSearchLoading: boolean;
    getUsers: () => Promise<void>;
    getInteractedUsers: () => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    setSelectedUser: (selectedUser: User | null) => void;
    setSelectedCommunity: (selectedCommunity: Community | null) => void;
    sendMessage: (message: Messages) => Promise<void>;
    subscribeToMessages: () => void;
    unsubscribeFromMessages: () => void;
    getSearchResults: (query: string) => Promise<void>;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
    messages: [],
    users: [],
    searchResults: null,
    community: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSearchLoading: false,
    selectedCommunity: null,

    // probably discontinued
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/messages/users');
            set({ users: res.data });
        } catch (error: unknown) {
            console.error('Erro ao buscar usuários', error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            toast.error("Internal server error");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getInteractedUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/messages/interacted-contacts');
            set({ users: res.data });
        } catch (error: unknown) {
            console.error('Erro ao buscar usuários', error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            toast.error("Internal server error");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId: string) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data.messages });
        } catch (error: unknown) {
            console.error('Erro ao buscar mensagens', error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    getSearchResults: async (query: string) => {
        set({ isSearchLoading: true });
        try {
            const res = await axiosInstance.get(`/search/${query}`);
            set({ searchResults: res.data });
        } catch (error: unknown) {
            console.error('Erro ao buscar resultados', error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        } finally {
            set({ isSearchLoading: false });
        }
    },

    sendMessage: async (msgData: Messages) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser?._id}`, msgData);
            set({ messages: [...messages || [], res.data.newMessage] })
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            toast.error("Internal server error");
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket?.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            set({ messages: [...get().messages, newMessage] });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
    },

    setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),

    setSelectedCommunity: (selectedCommunity: Community | null) => set({ selectedCommunity }),
}));

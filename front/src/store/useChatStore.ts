import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { AxiosError } from 'axios';

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

interface ChatStoreState {
    messages: [];
    users: User[];
    selectedUser: User | null;
    selectedCommunity: Community | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    getUsers: () => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    setSelectedUser: (selectedUser: User | null) => void;
    setSelectedCommunity: (selectedCommunity: Community | null) => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
    messages: [],
    users: [],
    community: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    selectedCommunity: null,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/messages/users');
            console.log(res.data);
            set({ users: res.data });
        } catch (error: unknown) {
            console.error('Erro ao buscar usuários', error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId: string) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error: unknown) {
            console.error('Erro ao buscar mensagens', error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    // todo: optimize this function
    setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),

    setSelectedCommunity: (selectedCommunity: Community | null) => set({ selectedCommunity }),
}));

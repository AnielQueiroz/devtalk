import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { AxiosError } from 'axios';
import { useAuthStore } from './useAuthStore';
import { showNotification } from '../lib/util';

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
    unreadCounts: Record<string, number>;
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
    getUnreadCounts: () => Promise<void>;
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
    unreadCounts: {},
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

            await axiosInstance.put(`/messages/mark-as-read/${userId}`);

            // Zerar a contagem de mensagens não lidas para o usuário selecionado
            set((state) => {
                const updatedUnreadCounts = { ...state.unreadCounts };
                updatedUnreadCounts[userId] = 0;
                return { unreadCounts: updatedUnreadCounts };
            });
        } catch (error: unknown) {
            console.error('Erro ao buscar mensagens', error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    getUnreadCounts: async () => {
        try {
            const res = await axiosInstance.get('/messages/unread-messages-count');
            const unreadCounts: Record<string, number> = {};

            for (const item of res.data.unreadMessagesCounts) {
                unreadCounts[item._id] = item.count;
            };

            set({ unreadCounts });
        } catch (error: unknown) {
            console.log('Erro ao buscar contagem de mensagens não lidas', error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            toast.error("Internal server error");
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
            set({ messages: [...messages || [], res.data.newMessage] });

            // checar se o selectedUser já está na lista de usuários
            if (!get().users.find((user) => user._id === selectedUser?._id)) {
                if (selectedUser) {
                    set({ users: [...get().users, selectedUser] });
                }
            }
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            toast.error("Internal server error");
        }
    },

    // minha implementação
    // subscribeToMessages: () => {
    //     const { selectedUser } = get();
    //     if (!selectedUser) return;

    //     const socket = useAuthStore.getState().socket;

    //     socket?.on("newMessage", (newMessage) => {
    //         const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
    //         if (!isMessageSentFromSelectedUser) return;
    //         set({ messages: [...get().messages, newMessage] });
    //     });
    // },

    // chatgpt implementação
    subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;

        if (!socket) return console.error('Socket não está disponível!');
    
        socket.on("newMessage", (newMessage) => {
            const { messages, selectedUser, unreadCounts } = get();

            // notificar
            const audio = new Audio("/sounds/notification.mp3");
            audio.play().catch(() => console.error('Erro ao tocar o som'));
    
            // Se a mensagem for do usuário selecionado, adiciona ao histórico
            if (newMessage.senderId === selectedUser?._id) {
                set({ messages: [...messages, newMessage] });
            } else {
                // Incrementa a contagem de mensagens não lidas para o remetente
                const senderId = newMessage.senderId;
                set({
                    unreadCounts: {
                        ...unreadCounts,
                        [senderId]: (unreadCounts[senderId] || 0) + 1,
                    },
                });

                // Notificação navegador
                // showNotification(
                //     '📩 Nova mensagem recebida!', {
                //         body: `Mensagem de ${newMessage.senderName}`,
                //         icon: '/logo.svg',
                //     },
                // )
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
    },

    setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),

    setSelectedCommunity: (selectedCommunity: Community | null) => set({ selectedCommunity }),
}));

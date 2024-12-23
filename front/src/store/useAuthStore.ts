import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { io, type Socket } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

interface AuthState {
	authUser: User | null;
	isSigningUp: boolean;
	isLoggingIn: boolean;
	isUpdatingProfile: boolean;
	isCheckingAuth: boolean;
	onlineUsers: string[];
	socket: Socket | null;
	checkAuth: () => Promise<void>;
	signUp: (data: Data, t: (key: string) => string) => Promise<void>;
	login: (data: Data, t: (key: string) => string) => Promise<void>;
	logout: (t: (key: string) => string) => Promise<void>;
	updateProfilePic: (data: string, t: (key: string) => string) => Promise<void>;
	connectSocket: () => void;
	disconnectSocket: () => void; 
}

interface Data {
	email: string;
	fullName?: string;
	password: string;
}

interface User {
	_id: string;
	email: string;
	fullName: string;
	profilePic?: string;
	createdAt: string;
	updatedAt: string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
	authUser: null,
	isSigningUp: false,
	isLoggingIn: false,
	isUpdatingProfile: false,
	isCheckingAuth: true,
	onlineUsers: [],
	socket: null,

	checkAuth: async () => {
		set({ isCheckingAuth: true });
		try {
			const res = await axiosInstance.get("/auth/check");

			set({ authUser: res.data });
			
			get().connectSocket()
		} catch (error) {
			set({ authUser: null });
			console.log("Erro ao verificar autenticação: ", error);
		} finally {
			set({ isCheckingAuth: false });
		}
	},

	signUp: async (data: Data, t: (key: string) => string): Promise<void> => {
		set({ isSigningUp: true });
		try {
			const res = await axiosInstance.post("/auth/signup", data);
			set({ authUser: res.data });
			toast.success(t("successCreateAccount"));
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data.message);
			}
			console.log("Erro ao fazer cadastro: ", error);
		} finally {
			set({ isSigningUp: false });
		}
	},

	login: async (data: Data, t: (key: string) => string): Promise<void> => {
		set({ isLoggingIn: true });
		try {
			const res = await axiosInstance.post("/auth/login", data);
			set({ authUser: res.data });
			toast.success(t('successLogin'));

			get().connectSocket();
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data.message);
			}
			console.log("Erro ao fazer login: ", error);
		} finally {
			set({ isLoggingIn: false });
		}
	},

	updateProfilePic: async (data: string, t: (key: string) => string): Promise<void> => {
		set({ isUpdatingProfile: true });
		try {
			const res = await axiosInstance.put("/auth/update-profile", { profilePic: data });
			
			set({ authUser: res.data });
			toast.success(t("successProfileUpdate"));
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				if (error.request.status === 413 || error.code === "ERR_NETWORK") {
					toast.error(t("errorProfilePicTooLarge"));
				} else {
					toast.error(error.response?.data.message || error.message);
				}
				console.log("Erro ao atualizar foto de perfil: ", error);
			}
			toast.error(t("unexpectedError"));
			console.log("Erro ao atualizar foto de perfil: ", error);
		} finally {
			set({ isUpdatingProfile: false });
		}
	},

	logout: async (t: (key: string) => string) => {
		try {
			await axiosInstance.post("/auth/logout");
			set({ authUser: null });
			toast.success(t("successLogout"));

			get().disconnectSocket();
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data.message);
			}
			console.log("Erro ao fazer logout: ", error);
		}
	},

	connectSocket: () => {
		const { authUser } = get();
		if (!authUser || get().socket?.connected) return;

		const socket = io(BASE_URL, {
			query: {
				userId: authUser._id,
			}
		});
		socket.connect();

		set({ socket: socket });

		socket.on("getOnlineUsers", (usersIds) => {
			set({ onlineUsers: usersIds })
		});
	},

	disconnectSocket: () => {
		if(get().socket?.connected) get().socket?.disconnect();
	},
}));

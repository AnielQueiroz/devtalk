import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

interface AuthState {
    authUser: null;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    isCheckingAuth: boolean;
    checkAuth: () => Promise<void>;
    signUp: (data: Data) => Promise<void>;
}

interface Data {
    email: string;
    fullName: string;
    password: string
}

export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    
    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");

            console.log(res.data);

            set({ authUser: res.data});
        } catch (error) {
            set({ authUser: null });
            console.log("Erro ao verificar autenticação: ", error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async(data) => {
        try {
            console.log(data);
        } catch (error) {
            console.log("Erro ao fazer cadastro: ", error);
        }
    }
}));
import { create } from "zustand";

interface ThemeStore {
    theme: string;
    setTheme: (theme: string) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: localStorage.getItem("chat-them") || "synthwave",
    setTheme: (theme: string) => {
        localStorage.setItem("chat-them", theme);
        set({ theme})
    } 
}));
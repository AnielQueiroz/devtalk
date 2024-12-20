import { create } from "zustand";

interface ThemeStore {
    theme: string;
    language: string
    setTheme: (theme: string) => void
    setLanguage: (language: string) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: localStorage.getItem("chat-them") || "synthwave",
    language: localStorage.getItem("devtalk-lang") || "pt",
    setTheme: (theme: string) => {
        localStorage.setItem("chat-them", theme);
        set({ theme})
    } ,
    setLanguage: (language: string) => {
        localStorage.setItem("devtalk-lang", language);
        set({ language })
    }
}));
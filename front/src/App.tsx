import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import SignupPage from "./pages/SignupPage"
import HomePage from "./pages/HomePage"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import { Toaster } from "react-hot-toast"
import Language from "./components/Language"
import LoadingCheck from "./components/LoadingCheck"
import { useThemeStore } from "./store/useThemeStore"
import ThemePage from "./pages/ThemePage"
import Terms from "./pages/TermsPage"
import { useChatStore } from "./store/useChatStore"
import { useCommunityStore } from "./store/useCommunityStore"

if (window.Notification.permission === "default") { 
  window.Notification.requestPermission();
};

function App() {
  const { authUser, checkAuth, isCheckingAuth, socket, connectSocket, disconnectSocket } = useAuthStore();
  const { theme } = useThemeStore();
  const location = useLocation();

  const { subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { subscribeToCommunityMessages, unsubscribeToCommunityMessages } = useCommunityStore();

  useEffect(() => {
    checkAuth();
    connectSocket();

    return () => disconnectSocket(); 
  }, [checkAuth, connectSocket, disconnectSocket]);

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("📡 Socket conectado? ", socket.connected);
      if (socket.connected && authUser) {
        subscribeToMessages();
        subscribeToCommunityMessages();
      }
    })

    return () => {
      unsubscribeToCommunityMessages();
      unsubscribeFromMessages();
    }
  }, [socket, authUser, subscribeToMessages, unsubscribeFromMessages, subscribeToCommunityMessages, unsubscribeToCommunityMessages]);
 
  if (isCheckingAuth && !authUser) return <LoadingCheck />

  const pathsWithoutNavbar = ["/login", "/signup"];
  const hideNavbar = pathsWithoutNavbar.includes(location.pathname);

  return (
    <div data-theme={theme}>
      {!hideNavbar && <Navbar />}
      {hideNavbar && (
        <Language />
      )}
      

      <Routes>
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/theme" element={authUser ? <ThemePage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

        {/* publics */}
        <Route path="/terms" element={<Terms />} />
      </Routes>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  )
}

export default App

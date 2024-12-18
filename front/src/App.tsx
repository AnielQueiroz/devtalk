import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from "./pages/SettingsPage"
import SignupPage from "./pages/SignupPage"
import HomePage from "./pages/HomePage"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Toaster } from "react-hot-toast"
import ProtectedRoute from "./utils/ProtectedRoute"

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="size-10 animate-spin" />
    </div>
  );

  const pathsWithoutNavbar = ["/login", "/signup"];
  const hideNavbar = pathsWithoutNavbar.includes(location.pathname);

  return (
    <div>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        
        {/* <Route path="/login" element={<ProtectedRoute element={<LoginPage />} />} />
        <Route path="/signup" element={<ProtectedRoute element={<SignupPage />} />} />
        <Route path="/settings" element={<ProtectedRoute element={<SettingsPage />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} /> */}
      </Routes>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  )
}

export default App

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import CallContainer from "./components/CallContainer"; // Import the video component

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useChatStore } from "./store/useChatStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect, useState } from "react"; // Add useState

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, socket } = useAuthStore(); // Get socket
  const { theme } = useThemeStore();
  const { subscribeToMessages, unsubscribeFromMessages } = useChatStore();

  // STATE FOR INCOMING CALLS
  const [incomingCall, setIncomingCall] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [authUser, subscribeToMessages, unsubscribeFromMessages]);

  // --- GLOBAL CALL LISTENER ---
  useEffect(() => {
    if (!socket) return;

    // Listen for call event
    socket.on("callUser", (data) => {
      console.log("Incoming call received!", data); // Check your console for this!
      setIncomingCall(data);
      setIsCallActive(true);
    });

    return () => {
      socket.off("callUser");
    };
  }, [socket]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      {/* GLOBAL CALL MODAL */}
      {isCallActive && (
        <CallContainer 
           isIncomingCall={incomingCall}
           onClose={() => {
             setIsCallActive(false);
             setIncomingCall(null);
           }}
           // If we started the call (not incoming), we need a way to pass targetUser. 
           // For now, this handles INCOMING calls perfectly.
        />
      )}

      <Toaster />
    </div>
  );
};
export default App;
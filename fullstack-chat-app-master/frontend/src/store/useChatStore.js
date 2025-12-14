import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadMessages: {}, // State for unread counts

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      set({ messages: get().messages.filter((m) => m._id !== messageId) });
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateMessage: async (messageId, newText) => {
    try {
      const res = await axiosInstance.put(`/messages/${messageId}`, { text: newText });
      set({
        messages: get().messages.map((m) => (m._id === messageId ? res.data : m)),
      });
      toast.success("Message updated");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      // FIX: Get the LATEST selectedUser directly inside the callback
      const { selectedUser, messages } = get(); 
      
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser?._id;

      if (isMessageSentFromSelectedUser) {
        // If chat is open, add message to screen
        set({
          messages: [...messages, newMessage],
        });
      } else {
        // If chat is closed or talking to someone else, add notification
        set((state) => ({
          unreadMessages: {
            ...state.unreadMessages,
            [newMessage.senderId]: (state.unreadMessages[newMessage.senderId] || 0) + 1,
          },
        }));
      }
    });

    socket.on("messageDeleted", (messageId) => {
       set({ messages: get().messages.filter((m) => m._id !== messageId) });
    });

    socket.on("messageUpdated", (updatedMessage) => {
       const { selectedUser, messages } = get();
       const isMessageFromSelectedUser = updatedMessage.senderId === selectedUser?._id;
       const isMessageToSelectedUser = updatedMessage.receiverId === selectedUser?._id;
       
       if (isMessageFromSelectedUser || isMessageToSelectedUser) {
           set({
             messages: messages.map((m) => (m._id === updatedMessage._id ? updatedMessage : m)),
           });
       }
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("messageDeleted");
    socket.off("messageUpdated");
  },

  setSelectedUser: (selectedUser) => {
    set((state) => ({
      selectedUser,
      unreadMessages: {
        ...state.unreadMessages,
        [selectedUser?._id]: 0, 
      }
    }));
  },
}));
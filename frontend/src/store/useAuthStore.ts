import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import type { UserResource as User } from "@clerk/shared/types";

const BASE_URL = import.meta.env.VITE_API_URL;

interface AuthState {
  authUser: User | null;
  onlineUsers: string[];
  socket: Socket | null;
  setAuthUser: (user: User) => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  authUser: null,
  onlineUsers: [],
  socket: null,

  setAuthUser: (user: User | null) => set({ authUser: user }),

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(BASE_URL, {
      query: {
        userId: authUser.id, // Clerk user id
      },
    });

    newSocket.connect();

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) socket.disconnect();
    set({ socket: null, onlineUsers: [] });
  },
}));
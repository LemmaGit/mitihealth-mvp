import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import type { UserResource as User } from "@clerk/shared/types";

const BASE_URL = import.meta.env.VITE_API_URL;
const SOCKET_BASE_URL = String(BASE_URL || "").replace(/\/api\/?$/, "");

interface AuthState {
  authUser: User | null;
  onlineUsers: string[];
  socket: Socket | null;
  setAuthUser: (user: User | null) => void;
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
    if (!authUser) return;

    // Reuse existing socket instance to avoid duplicate connections
    // during StrictMode re-renders and auth effect replays.
    if (socket) {
      if (!socket.connected) socket.connect();
      return;
    }

    const newSocket = io(SOCKET_BASE_URL, {
      autoConnect: false,
      query: {
        userId: authUser.id, // Clerk user id
      },
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    set({ socket: newSocket });
    newSocket.connect();
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) socket.disconnect();
    set({ socket: null, onlineUsers: [] });
  },
}));

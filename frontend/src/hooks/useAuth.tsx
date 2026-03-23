import { useEffect } from "react";
import { useUser } from "@clerk/react";
import { useAuthStore } from "../store/useAuthStore";

export default function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { setAuthUser, connectSocket, disconnectSocket } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      setAuthUser(user);
      connectSocket();
    } else {
      setAuthUser(null);
      disconnectSocket();
    }
  }, [user, isLoaded, setAuthUser, connectSocket, disconnectSocket]);

  return { user, isLoaded, isSignedIn };
}
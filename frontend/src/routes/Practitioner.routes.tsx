import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import Chat from "../pages/practitioner/Chat"
import Profile from "../pages/practitioner/Profile";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { useAppApi } from "../hooks/useAppApi";
import Loader from "../components/Loader";
import { ClipLoader } from "react-spinners";

function PractitionerRoutes() {
  const { authUser:user } = useAuthStore();
  const { practitioner } = useAppApi();
  const location = useLocation();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["practitioner", user?.id],
    queryFn: () => practitioner.getPractitioner(user?.id!),
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Loader ><ClipLoader color="#004c22" /></Loader>

  if (isError || !data || data.error) {
    if (!location.pathname.endsWith("/profile")) {
      return <Navigate to="/practitioner/profile" replace />;
    }
  }

  return (
    <Routes>
      <Route index element={<Navigate to="chat" replace />} />
      <Route path="chat" element={<Chat />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
  )
}

export default PractitionerRoutes
import { lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { useAppApi } from "../hooks/useAppApi";
const Chat = lazy(() => import("../pages/practitioner/Chat"));
const Profile = lazy(() => import("../pages/practitioner/Profile"));

function PractitionerRoutes() {
  const { authUser:user } = useAuthStore();
  const { practitioner } = useAppApi();
  const location = useLocation();
  
  const { data } = useQuery({
    queryKey: ["practitioner", user?.id],
    queryFn: () => practitioner.getPractitioner(user?.id!),
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (!data || data.error) {
    if (!location.pathname.endsWith("/profile")) {
      return <Navigate to="/practitioner/profile" replace />;
    }
  }

  if (data?.verificationStatus === "pending" && !location.pathname.endsWith("/profile")) {
    return <Navigate to="/practitioner/profile" replace />;
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
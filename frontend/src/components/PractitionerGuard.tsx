import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAppApi } from "../hooks/useAppApi";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";

interface PractitionerGuardProps {
  children: React.ReactNode;
  allowedPath?: string;
}

export default function PractitionerGuard({ children, allowedPath = "/practitioner/profile" }: PractitionerGuardProps) {
  const location = useLocation();
  const { authUser } = useAuthStore();
  const { practitioner } = useAppApi();

  const { data: practitionerData, isLoading } = useQuery({
    queryKey: ["practitioner", authUser?.id],
    queryFn: () => practitioner.getPractitioner(authUser?.id!),
    enabled: !!authUser?.id,
  });

  // Show loading while checking verification status
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  // If user is not a practitioner, allow access
  if (authUser?.unsafeMetadata?.role !== "practitioner") {
    return <>{children}</>;
  }

  // If practitioner is pending and not on allowed path, redirect to profile
  if (
    practitionerData?.verificationStatus === "pending" && 
    location.pathname !== allowedPath
  ) {
    return <Navigate to={allowedPath} replace />;
  }

  // Allow access
  return <>{children}</>;
}

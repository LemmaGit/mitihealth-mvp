import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom"
import { useUser } from "@clerk/react"
import { HashLoader } from "react-spinners"
import Loader from "../components/Loader"
import PractitionerGuard from "../components/PractitionerGuard"
import NotFound from "@/pages/NotFound";
import { withSuspense } from "../helper/withSuspense";

const MainLayout = withSuspense(lazy(() => import("../components/layouts/MainLayout")), true);
const SupplierRoutes = withSuspense(lazy(() => import("./Supplier.routes")));
const PatientRoutes = withSuspense(lazy(() => import("./Patient.routes")));
const PractitionerRoutes = withSuspense(lazy(() => import("./Practitioner.routes")));
const AdminRoutes = withSuspense(lazy(() => import("./Admin.routes")));
const Messages = withSuspense(lazy(() => import("../pages/Messages")));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  
  if (!isLoaded) {
    return <Loader isFullPage={true}>
        <HashLoader color="#166534" />
    </Loader>;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = user?.unsafeMetadata?.role;
  if (!hasRole) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

function UserRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute>
        <MainLayout />
        </ProtectedRoute>}>
        <Route path="admin/*" element={<AdminRoutes />} />
        <Route path="supplier/*" element={<SupplierRoutes />} />
        <Route path="patient/*" element={<PatientRoutes />} />
        <Route path="practitioner/*" element={
          <PractitionerGuard>
            <PractitionerRoutes />
          </PractitionerGuard>
        } />  
        <Route path="messages" element={<Messages />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
      <Route path="404" element={<NotFound />} />
    </Routes>
  )
}

export default UserRoutes

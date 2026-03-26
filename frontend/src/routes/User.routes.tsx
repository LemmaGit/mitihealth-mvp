import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom"
import { useUser } from "@clerk/react"
import { PropagateLoader } from "react-spinners"
import Loader from "../components/Loader"
import PractitionerGuard from "../components/PractitionerGuard"
const MainLayout = lazy(() => import("../components/layouts/MainLayout"));
const SupplierRoutes = lazy(() => import("./Supplier.routes"));
const PatientRoutes = lazy(() => import("./Patient.routes"));
const PractitionerRoutes = lazy(() => import("./Practitioner.routes"));
const AdminRoutes = lazy(() => import("./Admin.routes"));
const Messages = lazy(() => import("../pages/Messages"));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  
  if (!isLoaded) {
    return <Loader isFullPage={true}>
        <PropagateLoader color="#004c22" />
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
      </Route>
    </Routes>
  )
}

export default UserRoutes
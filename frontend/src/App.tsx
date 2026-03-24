import { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { LoginRoute, SignupRoute } from "./routes/Auth.routes";
import { PropagateLoader } from "react-spinners";
import Loader from "./components/Loader";
const Index = lazy(() => import("./pages/Index"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const UserRoutes = lazy(() => import("./routes/User.routes"));

const App = () => {
  const { user, isLoaded, isSignedIn } = useAuth();

  const userRole = user?.unsafeMetadata?.role;
  const getRootRedirect = () => {
    if (!isLoaded) return <Loader isFullPage={true}><PropagateLoader color="#004c22" /></Loader>
    if (!isSignedIn) return <Index />; 
    if (!userRole) return <Navigate to="/onboarding" replace />;
    
    return <Navigate to={`/${userRole as string}`} replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={getRootRedirect()} />
        <Route path="/login" element={<LoginRoute isSignedIn={isSignedIn} hasRole={userRole as string | undefined} />} />
        <Route path="/signup" element={<SignupRoute isSignedIn={isSignedIn} hasRole={userRole as string | undefined} />} />
        <Route path="/onboarding" element={
          isSignedIn ? (
            userRole ? <Navigate to={`/${userRole as string}`} replace /> : <Onboarding />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

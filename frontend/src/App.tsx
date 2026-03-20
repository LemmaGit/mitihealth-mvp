import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Show, SignIn, SignUp, UserButton, useUser } from "@clerk/react";
import Onboarding from "./pages/Onboarding.tsx";

function App() {
  const { user, isLoaded } = useUser();

  // Auto-redirect logic: if no role yet → force onboarding
  const hasRole = user?.unsafeMetadata?.role;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="p-4 border-b flex justify-between items-center bg-white">
          <h1 className="text-2xl font-bold text-green-700">MitiHealth</h1>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </header>

        <Routes>
          <Route path="/sign-in" element={<SignIn />} />

          <Route
            path="/sign-up"
            element={
              <SignUp
                fallbackRedirectUrl="/onboarding"
                forceRedirectUrl="/onboarding"
              />
            }
          />

          {/* ONBOARDING - ONLY if no role yet */}
          <Route
            path="/onboarding"
            element={
              <Show when="signed-in">
                {hasRole ? <Navigate to="/" replace /> : <Onboarding />}
              </Show>
            }
          />

          {/* HOME / DASHBOARD */}
          <Route
            path="/"
            element={
              <Show when="signed-in">
                {isLoaded && !hasRole ? (
                  <Navigate to="/onboarding" replace />
                ) : (
                  <div className="p-8 text-center">
                    <h2 className="text-3xl font-bold text-green-700">
                      Welcome to MitiHealth! 🎉
                    </h2>
                    <p className="mt-4 text-gray-600">
                      You are logged in as{" "}
                      <strong>{user?.unsafeMetadata?.role}</strong>
                    </p>
                  </div>
                )}
              </Show>
            }
          />

          <Route path="*" element={<Navigate to="/sign-up" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

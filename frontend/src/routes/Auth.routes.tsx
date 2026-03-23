import { Navigate } from "react-router-dom"
import AuthWrapper from "../components/AuthWrapper"
import { SignIn, SignUp } from "@clerk/react"

export function LoginRoute({isSignedIn, hasRole}: {isSignedIn: boolean | undefined, hasRole: string | undefined}) {
  return isSignedIn ? (
    <Navigate to={hasRole ? `/${hasRole as string}` : "/onboarding"} replace />
  ) : (
    <AuthWrapper>
      <SignIn />
    </AuthWrapper>
  );
}

export function SignupRoute({isSignedIn, hasRole}: {isSignedIn: boolean | undefined, hasRole: string | undefined}) {
  return isSignedIn ? (
    <Navigate to={hasRole ? `/${hasRole as string}` : "/onboarding"} replace />
  ) : (
    <AuthWrapper>
      <SignUp forceRedirectUrl="/onboarding" />
    </AuthWrapper>
  );
}
import { SignIn } from "@clerk/react";
import AuthWrapper from "../components/AuthWrapper";

export default function Login() {
  return (
    <AuthWrapper>
      <SignIn />
    </AuthWrapper>
  );
}
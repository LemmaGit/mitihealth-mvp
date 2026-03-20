import { useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Onboarding() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  // Extra safety: if role already exists, never show onboarding
  useEffect(() => {
    if (isLoaded && user?.unsafeMetadata?.role) {
      navigate("/", { replace: true });
    }
  }, [isLoaded, user, navigate]);

  const selectRole = async (role: string) => {
    if (!user) return;

    await user.update({
      unsafeMetadata: { role },
    });

    // Small delay so Clerk updates, then go home
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 800);
  };

  if (!isLoaded) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <h2 className="text-3xl font-bold mb-8 text-green-700">
        Choose your role
      </h2>
      <p className="mb-8 text-gray-600">
        This can only be done once. Choose carefully.
      </p>

      <div className="space-y-4">
        {["patient", "practitioner", "supplier"].map((role) => (
          <button
            key={role}
            onClick={() => selectRole(role)}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-lg font-medium transition"
          >
            I am a {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

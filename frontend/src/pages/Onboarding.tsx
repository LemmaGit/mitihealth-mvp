import { Link } from "react-router-dom";
import { Leaf, User, Stethoscope, Package, ArrowRight } from "lucide-react";
import { useClerk, useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    icon: User,
    title: "I am a Patient",
    desc: "Seek natural remedies, book consultations with certified herbalists, and manage your botanical wellness journey.",
    cta: "Start my journey",
    role: "patient",
  },
  {
    icon: Stethoscope,
    title: "I am a Practitioner",
    desc: "Provide expert advice, manage appointments, and prescribe traditional medicine with clinical oversight.",
    cta: "Join as expert",
    role: "practitioner",
  },
  {
    icon: Package,
    title: "I am a Supplier",
    desc: "Distribute organic herbs, handcrafted tinctures, and raw botanical ingredients to our marketplace.",
    cta: "Register shop",
    role: "supplier",
  },
];

export default function Onboarding() {
  const { user, isLoaded } = useUser();
     const { signOut } = useClerk()

  const navigate = useNavigate();

  const handleRoleSelect = async (role: string) => {
    if (!user) return;

    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: role,
          onboardingCompleted: true,
        },
      });
      
      if (role === "practitioner") {
        navigate("/practitioner/profile");
        return;
      }
      navigate("/");
    } catch (error) {
      console.error("Error updating user role:", error);
      // Optionally show an error toast/notification here
    }
  };


  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Leaf className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen overflow-y-auto! botanical-gradient flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12 text-primary-foreground lg:px-8 lg:pb-24 lg:pt-20">
        {/* Decorative leaves */}
        <Leaf className="absolute left-6 top-8 opacity-20" size={80} strokeWidth={1} />
        <Leaf className="absolute right-8 top-4 opacity-10" size={120} strokeWidth={1} />

        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-display text-lg font-semibold text-primary-foreground/80">MitiHealth</h2>
          <div className="mx-auto mb-4 mt-1 h-1 w-10 rounded-full bg-secondary" />

          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
            Welcome to MitiHealth.
            <br />
            <span className="text-primary-foreground/70">Tell us who you are.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-primary-foreground/70 lg:text-lg">
            Join our community of herbal wisdom and clinical precision. Select your path to begin your personalized experience.
          </p>
        </div>
      </section>

      {/* Role cards */}
      <section className="px-4 pb-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {roles.map((role) => (
            <button
              key={role.title}
              onClick={() => handleRoleSelect(role.role)}
              className="group rounded-xl bg-primary-foreground/10 p-8 backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/15 ghost-border text-left w-full cursor-pointer"
            >
              <role.icon size={32} className="text-primary-foreground/80" />
              <h3 className="mt-12 font-display text-xl font-bold text-primary-foreground md:text-2xl">
                {role.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
                {role.desc}
              </p>
              <p className="mt-8 flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors group-hover:text-primary-foreground">
                {role.cta} <ArrowRight size={16} />
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Heritage line */}
      

      {/* Sign in link */}
      <div className="py-12 text-center">
        <p className="text-sm text-primary-foreground">
          Already have an account?{" "}
          <Link onClick={() => signOut()} to="/login" className="font-semibold text-primary-foreground hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
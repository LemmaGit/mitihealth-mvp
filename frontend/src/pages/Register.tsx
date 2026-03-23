import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { User, Stethoscope, Package, Leaf } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { useState } from "react";
import { cn } from "../lib/utils";

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const roles = [
  { id: "patient", label: "PATIENT", icon: User },
  { id: "practitioner", label: "PRACTITIONER", icon: Stethoscope },
  { id: "supplier", label: "SUPPLIER", icon: Package },
];

export default function Register() {
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState(searchParams.get("role") || "patient");
  const { register, handleSubmit } = useForm<RegisterForm>();
  const onSubmit = (data: RegisterForm) => console.log({ ...data, role: selectedRole });

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden w-[45%] flex-col justify-between bg-muted p-10 lg:flex">
        <div>
          <div className="flex items-center gap-2">
            <Leaf size={22} className="text-primary" />
            <span className="font-display text-xl font-bold">MitiHealth</span>
          </div>

          <div className="mt-8">
            <p className="text-base text-foreground">Ancient Wisdom,</p>
            <p className="text-base italic text-primary">Modern Precision.</p>
          </div>

          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Join a sanctuary of herbal knowledge where traditional Ethiopian botanicals meet modern health standards.
          </p>
        </div>

        {/* Large faded leaf illustration area */}
        <div className="my-8 flex-1 rounded-2xl bg-border/20" />

        <div className="rounded-xl bg-card p-4">
          <span className="text-xs font-medium uppercase tracking-wider text-primary">Did you know?</span>
          <p className="mt-2 text-sm italic text-muted-foreground">
            "Miti" derives from the Amharic word for botanical elements used in healing rituals for centuries.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16">
        <h1 className="font-display text-2xl font-bold text-foreground">Create an account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Join as a Patient, Practitioner, or Supplier
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {/* Role selector */}
          <div className="grid grid-cols-3 gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl py-5 transition-all ghost-border",
                  selectedRole === role.id
                    ? "bg-muted ring-2 ring-primary"
                    : "bg-background hover:bg-muted"
                )}
              >
                <role.icon size={24} className={selectedRole === role.id ? "text-primary" : "text-muted-foreground"} />
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  {role.label}
                </span>
              </button>
            ))}
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Email or Phone Number
            </label>
            <Input
              {...register("email", { required: true })}
              type="email"
              placeholder="example@health.com"
              className="h-12 bg-muted border-none focus-visible:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <Input
                {...register("password", { required: true })}
                type="password"
                placeholder="••••••••"
                className="h-12 bg-muted border-none focus-visible:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Confirm Password
              </label>
              <Input
                {...register("confirmPassword", { required: true })}
                type="password"
                placeholder="••••••••"
                className="h-12 bg-muted border-none focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              I agree to the{" "}
              <span className="font-medium text-foreground underline">Terms & Conditions</span> and{" "}
              <span className="font-medium text-foreground underline">Privacy Policy</span>
            </label>
          </div>

          <Button type="submit" className="h-14 w-full botanical-gradient text-base font-semibold text-primary-foreground">
            Create Account
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/30" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-xs uppercase tracking-wider text-muted-foreground">
                Social Signup
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" className="h-12 bg-muted border-none">
              Google
            </Button>
            <Button variant="outline" type="button" className="h-12 bg-muted border-none">
              Facebook
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-foreground hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

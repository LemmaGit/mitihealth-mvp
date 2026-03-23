import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useSignIn } from "@clerk/react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import DecorativeLeft from "../components/DecorativeLeft";

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export default function Login() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { signIn, isLoaded } = useSignIn();

  const onSubmit = async (data: LoginForm) => {
    if (!isLoaded) return;

    try {
      const { error } = await signIn.password({
        emailAddress: data.email,
        password: data.password,
      });

      if (error) {
        alert(error.errors?.[0]?.message || "Login failed");
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl("/");
            window.location.href = url;
          },
        });
      } else {
        console.error("Sign-in not complete:", signIn.status);
      }
    } catch (err: any) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center px-6">
        <Link to="/" className="font-display text-xl font-bold text-foreground">
          MitiHealth
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="flex w-full max-w-5xl flex-col gap-8 lg:flex-row lg:gap-16">

          {/* ✅ Decorative LEFT panel (kept exactly) */}
          <DecorativeLeft />

          {/* Right form */}
          <div className="flex flex-1 flex-col justify-center">
            <h1 className="font-display text-3xl font-bold text-primary">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Please enter your details to access your health portal.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">

              {/* Email */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase text-muted-foreground">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
                  <Input
                    {...register("email", { required: true })}
                    type="email"
                    placeholder="name@example.com"
                    className="h-12 pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex justify-between">
                  <label className="text-xs font-medium uppercase text-muted-foreground">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
                  <Input
                    {...register("password", { required: true })}
                    type="password"
                    placeholder="••••••••"
                    className="h-12 pl-10"
                  />
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-muted-foreground">
                  Keep me signed in for 30 days
                </label>
              </div>

              {/* Submit */}
              <Button type="submit" className="h-14 w-full text-base font-semibold">
                Login <ArrowRight size={18} />
              </Button>

              {/* CAPTCHA (required) */}
              <div id="clerk-captcha" />

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/30" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-4 text-xs uppercase tracking-wider text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full flex items-center gap-2"
                onClick={() =>
                  signIn?.authenticateWithRedirect({
                    strategy: "oauth_google",
                    redirectUrl: "/sso-callback",
                    redirectUrlComplete: "/",
                  })
                }
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-5 w-5"
                />
                Continue with Google
              </Button>

              {/* Register */}
              <p className="mt-4 text-center text-sm text-muted-foreground">
                New to MitiHealth?{" "}
                <Link to="/register" className="font-semibold text-foreground hover:underline">
                  Register
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
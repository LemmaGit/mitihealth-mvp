import { Leaf } from "lucide-react";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Left Decorative Panel */}
        <div
          className="relative w-1/2 shrink-0 overflow-hidden"
          style={{
            backgroundImage:
              "url('https://plus.unsplash.com/premium_photo-1683444544782-5cb46105721e?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-green-900/50 backdrop-blur-none"></div>

          <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
            <div>
              <span className="inline-block rounded bg-white/20 px-3 py-1 text-xs uppercase tracking-widest">
                Herbal Intelligence
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight">
                Natural Healing,
                <br />
                <span className="text-white/70">Powered by Technology</span>
              </h1>
            </div>

            <div className="flex items-center justify-center mt-6">
              <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center backdrop-blur">
                <Leaf size={50} />
              </div>
            </div>

            <div className="flex items-start gap-3 mt-6">
              <div className="p-2 rounded-full bg-white/20">
                <Leaf size={18} />
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Connect with trusted herbal practitioners and discover natural remedies tailored to your health.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      <div className="lg:hidden relative h-screen overflow-hidden">
        <div
          className="fixed inset-0 overflow-hidden"
          style={{
            backgroundImage:
              "url('https://plus.unsplash.com/premium_photo-1683444544782-5cb46105721e?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-green-900/50 backdrop-blur-none"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-screen px-6 py-12">
            {children}
        </div>
      </div>
    </>
  );
}

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-background to-muted/30 min-h-screen">
      <div className="mx-auto p-8 max-w-md text-center">
        <div className="relative mb-8">
          <div className="font-bold text-primary/20 text-8xl">404</div>
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="font-bold text-primary text-2xl">Oops!</div>
          </div>
        </div>
        
        <h2 className="mb-4 font-semibold text-foreground text-2xl">Page Not Found</h2>
        <p className="mb-8 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex sm:flex-row flex-col justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-6 py-3 rounded-lg text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 px-6 py-3 rounded-lg text-primary-foreground transition-colors"
          >
            <Home size={18} />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

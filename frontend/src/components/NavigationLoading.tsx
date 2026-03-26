import { PropagateLoader } from "react-spinners";
import { useNavigationLoading } from "../hooks/useNavigationLoading";

const NavigationLoading = () => {
  const isLoading = useNavigationLoading();

  if (!isLoading) return null;

  return (
    <div className="top-16 right-0 left-0 z-50 fixed bg-background h-1">
      <div className="bg-primary/20 h-full animate-pulse">
        <PropagateLoader 
          color="#004c22" 
          size={6} 
          cssOverride={{
            position: 'absolute',
            top: '50%',
            left: '20px',
            transform: 'translateY(-50%)'
          }}
        />
      </div>
    </div>
  );
};

export default NavigationLoading;

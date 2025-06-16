import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      // Otherwise, redirect to login
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">
        <p className="text-lg">Redirecionando...</p>
      </div>
    </div>
  );
};

export default Index;

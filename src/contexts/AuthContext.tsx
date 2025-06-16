
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";

// Define branch types
export type BranchId = "Esteio 01" | "Esteio 02" | "Esteio 03" | "Esteio 04" | 
                     "Esteio 05" | "Esteio 06" | "Esteio 07" | "Esteio 08" | "Esteio 09";

export const ALL_BRANCHES: BranchId[] = [
  "Esteio 01", "Esteio 02", "Esteio 03", "Esteio 04", "Esteio 05", 
  "Esteio 06", "Esteio 07", "Esteio 08", "Esteio 09"
];

// Define auth context types
interface AuthContextType {
  currentBranch: BranchId | null;
  login: (branchId: BranchId, password: string) => Promise<boolean>;
  logout: () => void;
  isLoggedIn: boolean;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props type
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentBranch, setCurrentBranch] = useState<BranchId | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabaseConfigured = isSupabaseConfigured();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check localStorage first for a stored branch
        const storedBranch = localStorage.getItem("currentBranch");
        if (storedBranch && ALL_BRANCHES.includes(storedBranch as BranchId)) {
          setCurrentBranch(storedBranch as BranchId);
          setIsLoggedIn(true);
          return;
        }
        
        // Then check Supabase session if configured
        if (supabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            const userEmail = session.user.email;
            // Extract branch from email if it exists
            const branch = ALL_BRANCHES.find(b => 
              userEmail?.toLowerCase() === `${b.toLowerCase()}@esteio.com`
            );
            
            if (branch) {
              setCurrentBranch(branch);
              setIsLoggedIn(true);
              localStorage.setItem("currentBranch", branch);
            }
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    checkSession();
  }, [supabaseConfigured]);

  const login = async (branchId: BranchId, password: string): Promise<boolean> => {
    try {
      console.log("Login attempt for branch:", branchId);
      
      // For testing purposes, allow login with the branch name as password
      // This is a fallback mode that works even if Supabase isn't configured
      if (password === branchId) {
        console.log("Local authentication successful");
        setCurrentBranch(branchId);
        setIsLoggedIn(true);
        localStorage.setItem("currentBranch", branchId);
        return true;
      }
      
      // Try Supabase authentication if configured
      if (supabaseConfigured) {
        const email = `${branchId.toLowerCase()}@esteio.com`;
        console.log("Trying Supabase auth with email:", email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (error) {
          console.error("Supabase auth error:", error);
          toast.error("Erro de autenticação", {
            description: error.message
          });
          return false;
        }

        if (data.user) {
          console.log("Supabase authentication successful");
          setCurrentBranch(branchId);
          setIsLoggedIn(true);
          localStorage.setItem("currentBranch", branchId);
          return true;
        }
      }

      toast.error("Erro de autenticação", {
        description: "Credenciais inválidas"
      });
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Erro no login", {
        description: "Não foi possível fazer login. Tente novamente."
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      if (supabaseConfigured) {
        await supabase.auth.signOut();
      }
      setCurrentBranch(null);
      setIsLoggedIn(false);
      localStorage.removeItem("currentBranch");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentBranch, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

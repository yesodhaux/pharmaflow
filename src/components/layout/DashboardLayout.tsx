
import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PillIcon, LayoutDashboardIcon, ArrowLeftRightIcon, History, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchSourceToggle } from "@/components/SearchSourceToggle";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { currentBranch, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  // Start with false for mobile devices, ensuring sidebar is always closed initially on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Set initial sidebar state based on device type when component mounts
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboardIcon className="w-5 h-5" />,
    },
    {
      name: "Nova Transferência",
      path: "/new-transfer",
      icon: <ArrowLeftRightIcon className="w-5 h-5" />,
    },
    {
      name: "Histórico",
      path: "/history",
      icon: <History className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <div className="fixed z-50 top-4 left-4 lg:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-card shadow-md"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        <ThemeToggle />
        <SearchSourceToggle />
      </div>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-sidebar transition-transform duration-200 ease-in-out lg:translate-x-0 border-r shadow-sm",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo & branch info */}
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
                <PillIcon className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-white leading-none">Esteio Pharma</h1>
                <p className="text-sm text-white/80 leading-none">Flow</p>
              </div>
            </div>
            
            <div className="mt-6 text-white">
              <p className="text-sm text-white/70">Filial logada:</p>
              <p className="font-medium text-white">{currentBranch}</p>
            </div>
          </div>

          <Separator className="bg-sidebar-border" />

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={cn(
                  "flex items-center px-4 py-3 text-white/90 rounded-md hover:bg-sidebar-accent group transition-colors",
                  location.pathname === link.path && "bg-sidebar-accent text-white"
                )}
              >
                <span className="mr-3">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 mt-auto">
            <Button 
              variant="outline" 
              className="w-full bg-white/10 text-white hover:bg-white/20 hover:text-white" 
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        "flex-1 overflow-y-auto p-4 pt-16 lg:pt-4 transition-all duration-200 ease-in-out",
        isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
      )}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

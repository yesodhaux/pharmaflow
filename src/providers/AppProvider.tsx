
import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { TransferProvider } from "@/contexts/TransferContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <AuthProvider>
          <TransferProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </TransferProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

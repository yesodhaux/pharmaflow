
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BranchId } from "@/contexts/AuthContext";

interface DashboardHeaderProps {
  currentBranch: BranchId | null;
  lastRefreshTime: number;
}

export const DashboardHeader = ({ currentBranch, lastRefreshTime }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo, {currentBranch}. Gerencie suas transferências de medicamentos.
          <br />
          <small className="text-xs">
            Última atualização: {new Date(lastRefreshTime).toLocaleTimeString()}
          </small>
        </p>
      </div>
    </div>
  );
};


import DashboardLayout from "@/components/layout/DashboardLayout";
import { useTransfer } from "@/contexts/TransferContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HistoryFilters } from "@/components/history/HistoryFilters";
import { TransferCard } from "@/components/history/TransferCard";
import { EmptyState } from "@/components/history/EmptyState";
import { useTransferHistory } from "@/hooks/useTransferHistory";

const History = () => {
  const { currentBranch } = useAuth();
  const { getTransfersForBranch } = useTransfer();
  const navigate = useNavigate();

  // Get all transfers for current branch
  const allTransfers = currentBranch ? getTransfersForBranch(currentBranch) : [];
  
  const {
    branchFilter,
    setBranchFilter,
    searchQuery,
    setSearchQuery,
    dateFilter,
    setDateFilter,
    filteredTransfers,
    uniqueDates
  } = useTransferHistory(allTransfers);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Histórico de Transferências</h1>
            <p className="text-muted-foreground">
              Consulte o histórico completo de transferências da sua filial
            </p>
          </div>
          <Button onClick={() => navigate("/new-transfer")}>
            Nova Transferência
          </Button>
        </div>

        <HistoryFilters
          branchFilter={branchFilter}
          setBranchFilter={setBranchFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentBranch={currentBranch}
          uniqueDates={uniqueDates}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">
              Resultados ({filteredTransfers.length})
            </h2>
          </div>
          
          {filteredTransfers.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {filteredTransfers.map((transfer) => (
                <TransferCard
                  key={transfer.id}
                  transfer={transfer}
                  currentBranch={currentBranch}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default History;

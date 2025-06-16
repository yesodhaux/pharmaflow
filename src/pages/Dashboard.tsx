import { useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useTransfer, TransferStatus } from "@/contexts/TransferContext";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardStatusGroup } from "@/components/dashboard/DashboardStatusGroup";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { TransferTabs } from "@/components/dashboard/TransferTabs";
import { AutoRefresh } from "@/components/dashboard/AutoRefresh";
import { NotificationSystem } from "@/components/dashboard/NotificationSystem";

const Dashboard = () => {
  const { currentBranch } = useAuth();
  const { getTransfersForBranch } = useTransfer();
  const { loadTransfers } = useTransfer(); // Keep separate to control when it's called

  const [statusFilter, setStatusFilter] = useState<TransferStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasNewRequests, setHasNewRequests] = useState(false);
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>("incoming");
  const tabsRef = useRef<HTMLDivElement>(null);

  // Get all transfers for current branch
  const allTransfers = currentBranch ? getTransfersForBranch(currentBranch) : [];

  // Filter transfers based on selected status and search query
  const filteredTransfers = allTransfers.filter((transfer) => {
    const matchesStatus = statusFilter === "all" || transfer.status === statusFilter;
    const matchesSearch =
      transfer.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Split transfers by direction
  const incomingTransfers = filteredTransfers.filter(
    (transfer) => transfer.toBranch === currentBranch
  );
  const outgoingTransfers = filteredTransfers.filter(
    (transfer) => transfer.fromBranch === currentBranch
  );

  // Count incoming transfers by status
  const incomingStatusCounts = {
    all: incomingTransfers.length,
    solicitado: incomingTransfers.filter((t) => t.status === "Solicitado").length,
    emPreparo: incomingTransfers.filter((t) => t.status === "Em preparo").length,
    enviado: incomingTransfers.filter((t) => t.status === "Enviado").length,
    concluido: incomingTransfers.filter((t) => t.status === "Concluído").length,
  };

  // Count outgoing transfers by status
  const outgoingStatusCounts = {
    all: outgoingTransfers.length,
    solicitado: outgoingTransfers.filter((t) => t.status === "Solicitado").length,
    emPreparo: outgoingTransfers.filter((t) => t.status === "Em preparo").length,
    enviado: outgoingTransfers.filter((t) => t.status === "Enviado").length,
    concluido: outgoingTransfers.filter((t) => t.status === "Concluído").length,
  };

  const handleSolicitadasClick = () => {
    setActiveTab("incoming");
    tabsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <DashboardLayout>
      <AutoRefresh onRefresh={loadTransfers} interval={30000}>
        {({ lastRefreshTime }) => (
          <div className="space-y-6">
            <NotificationSystem 
              incomingTransfers={incomingTransfers} 
              currentBranch={currentBranch}
              onNewRequestsChange={setHasNewRequests}
            />
            
            <DashboardHeader 
              currentBranch={currentBranch} 
              lastRefreshTime={lastRefreshTime} 
            />

            <div>
              <h2 className="text-lg font-semibold mb-1">Transferências Recebidas</h2>
              <DashboardStatusGroup
                direction="incoming"
                counts={incomingStatusCounts}
                hasNewRequests={hasNewRequests}
                onSolicitadasClick={handleSolicitadasClick}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-1">Transferências Enviadas</h2>
              <DashboardStatusGroup direction="outgoing" counts={outgoingStatusCounts} />
            </div>

            <DashboardFilters
              statusFilter={statusFilter}
              searchQuery={searchQuery}
              onStatusFilterChange={setStatusFilter}
              onSearchQueryChange={setSearchQuery}
            />

            <div ref={tabsRef}>
              <TransferTabs 
                incomingTransfers={incomingTransfers}
                outgoingTransfers={outgoingTransfers}
                currentBranch={currentBranch}
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as 'incoming' | 'outgoing')}
                hasNewRequests={hasNewRequests}
              />
            </div>
          </div>
        )}
      </AutoRefresh>
    </DashboardLayout>
  );
};

export default Dashboard;

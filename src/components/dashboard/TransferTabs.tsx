
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTransfersList } from "@/components/dashboard/DashboardTransfersList";
import { Transfer } from "@/contexts/TransferContext";
import { BranchId } from "@/contexts/AuthContext";

interface TransferTabsProps {
  incomingTransfers: Transfer[];
  outgoingTransfers: Transfer[];
  currentBranch: BranchId | null;
  value: string;
  onValueChange: (value: string) => void;
  hasNewRequests?: boolean;
}

export const TransferTabs = ({
  incomingTransfers,
  outgoingTransfers,
  currentBranch,
  value,
  onValueChange,
  hasNewRequests,
}: TransferTabsProps) => {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="incoming">Recebidas ({incomingTransfers.length})</TabsTrigger>
        <TabsTrigger value="outgoing">Enviadas ({outgoingTransfers.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="incoming" className="space-y-4">
        <DashboardTransfersList
          transfers={incomingTransfers}
          type="incoming"
          currentBranch={currentBranch}
          hasNewRequests={hasNewRequests}
        />
      </TabsContent>
      <TabsContent value="outgoing" className="space-y-4">
        <DashboardTransfersList
          transfers={outgoingTransfers}
          type="outgoing"
          currentBranch={currentBranch}
        />
      </TabsContent>
    </Tabs>
  );
};

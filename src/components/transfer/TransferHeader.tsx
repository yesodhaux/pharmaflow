
import { Badge } from "@/components/ui/badge";
import { useTransferStatus } from "@/hooks/useTransferStatus";
import { Transfer } from "@/types/transfer";

interface TransferHeaderProps {
  transfer: Transfer;
}

export const TransferHeader = ({ transfer }: TransferHeaderProps) => {
  const { getStatusBadgeColor } = useTransferStatus(transfer.status, false, false);

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Detalhes da Transferência</h1>
        <p className="text-muted-foreground">
          ID: {transfer.id}
        </p>
      </div>
      <Badge className={getStatusBadgeColor(transfer.status)}>
        {transfer.status}
      </Badge>
    </div>
  );
};

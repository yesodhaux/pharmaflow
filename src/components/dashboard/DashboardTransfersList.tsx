
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListChecksIcon, CalendarIcon, BarChart3 } from "lucide-react";
import { useTransferStatus } from "@/hooks/useTransferStatus";
import { Transfer } from "@/contexts/TransferContext";
import React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Props {
  transfers: Transfer[];
  type: "incoming" | "outgoing";
  currentBranch: string | null;
  hasNewRequests?: boolean;
}

export const DashboardTransfersList: React.FC<Props> = ({
  transfers,
  type,
  currentBranch,
  hasNewRequests,
}) => {
  const navigate = useNavigate();
  const { getStatusBadgeColor } = useTransferStatus("Solicitado", false, false);

  const handleViewTransfer = (transferId: string) => {
    navigate(`/transfer/${transferId}`);
  };

  const getOtherBranch = (transfer: Transfer) =>
    type === "incoming" ? transfer.fromBranch : transfer.toBranch;

  const getOtherBranchLabel = type === "incoming" ? "De" : "Para";

  const listEmptyMessage =
    type === "incoming"
      ? "Não há transferências recebidas com os filtros selecionados."
      : "Não há transferências enviadas com os filtros selecionados.";

  return transfers.length === 0 ? (
    <div className="text-center p-8 bg-muted/50 rounded-lg">
      <ListChecksIcon className="mx-auto h-8 w-8 text-muted-foreground" />
      <h3 className="mt-2 text-lg font-medium">Nenhuma transferência encontrada</h3>
      <p className="text-muted-foreground">{listEmptyMessage}</p>
    </div>
  ) : (
    <div className="grid gap-4">
      {transfers.map((transfer) => {
        const isNewIncomingRequest =
          type === "incoming" &&
          hasNewRequests &&
          transfer.status === "Solicitado";

        return (
          <Card
            key={transfer.id}
            className={cn(
              "hover:shadow-md transition-shadow",
              isNewIncomingRequest &&
                "animate-pulse bg-red-50 border-red-200 shadow-sm shadow-red-100 dark:bg-red-900/20 dark:border-red-800/50"
            )}
          >
            <CardContent className="p-4">
              <div className="grid gap-2 md:grid-cols-6">
                <div className="md:col-span-3">
                  <p className="font-medium">{transfer.product}</p>
                  <p className="text-sm text-muted-foreground">{transfer.id}</p>
                  
                  {/* Informações detalhadas do produto */}
                  <div className="space-y-1 mt-1">
                    {transfer.productBarcode && (
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Barras:</span>
                        <span className="text-xs font-mono bg-muted px-1 rounded">{transfer.productBarcode}</span>
                      </div>
                    )}
                    {transfer.productInternalCode && (
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Interno:</span>
                        <span className="text-xs font-mono bg-muted px-1 rounded">{transfer.productInternalCode}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {format(new Date(transfer.requestDate), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
                <div className="flex flex-col space-y-1 md:col-span-2">
                  <p className="text-sm">
                    <span className="text-muted-foreground">{getOtherBranchLabel}:</span>{" "}
                    <span className="font-medium">{getOtherBranch(transfer)}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Qtd:</span>{" "}
                    <span className="font-medium">{transfer.quantity}</span>
                  </p>
                  <Badge className={`w-fit ${getStatusBadgeColor(transfer.status)}`}>
                    {transfer.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewTransfer(transfer.id)}
                  >
                    Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

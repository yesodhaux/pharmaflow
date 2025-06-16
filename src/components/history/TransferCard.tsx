
import { Transfer } from "@/contexts/TransferContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageIcon, CalendarIcon, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface TransferCardProps {
  transfer: Transfer;
  currentBranch: string | null;
}

export function TransferCard({ transfer, currentBranch }: TransferCardProps) {
  const navigate = useNavigate();

  const getStatusBadgeColor = (status: Transfer["status"]) => {
    switch (status) {
      case "Solicitado": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Em preparo": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Enviado": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "Concluído": return "bg-green-100 text-green-800 hover:bg-green-200";
      default: return "";
    }
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <PackageIcon className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">{transfer.product}</h3>
              <Badge className={getStatusBadgeColor(transfer.status)}>
                {transfer.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{transfer.id}</p>
            
            {/* Informações detalhadas do produto */}
            <div className="space-y-1">
              {transfer.productBarcode && (
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Cód. Barras:</span>
                  <span className="text-xs font-mono bg-muted px-1 rounded">{transfer.productBarcode}</span>
                </div>
              )}
              {transfer.productInternalCode && (
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Cód. Interno:</span>
                  <span className="text-xs font-mono bg-muted px-1 rounded">{transfer.productInternalCode}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <p className="text-sm flex items-center">
                <CalendarIcon className="mr-1 h-3 w-3 text-muted-foreground" />
                {formatDateTime(transfer.requestDate)}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Quantidade:</span>{" "}
                {transfer.quantity}
              </p>
            </div>
          </div>

          <div className="space-y-2 md:text-right">
            <div className="flex md:flex-col md:items-end space-x-2 md:space-x-0">
              <p className="text-sm">
                <span className="text-muted-foreground">De:</span>{" "}
                <span className={transfer.fromBranch === currentBranch ? "font-medium" : ""}>
                  {transfer.fromBranch}
                </span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Para:</span>{" "}
                <span className={transfer.toBranch === currentBranch ? "font-medium" : ""}>
                  {transfer.toBranch}
                </span>
              </p>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate(`/transfer/${transfer.id}`)}
            >
              Ver Detalhes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

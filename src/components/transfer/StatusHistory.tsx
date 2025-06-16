
import { Calendar, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTransferStatus } from "@/hooks/useTransferStatus";
import { StatusHistoryEntry } from "@/types/transfer";
import { format } from "date-fns";
import * as LucideIcons from "lucide-react";

interface StatusHistoryProps {
  statusHistory: StatusHistoryEntry[];
}

export const StatusHistory = ({ statusHistory }: StatusHistoryProps) => {
  const { getStatusIcon } = useTransferStatus("Solicitado", false, false);

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Histórico de Status</h3>
      <div className="space-y-3 mt-2">
        {statusHistory.map((statusUpdate, index) => {
          const iconName = getStatusIcon(statusUpdate.status);
          // @ts-ignore - dynamically accessing icon components
          const IconComponent = iconName ? LucideIcons[iconName] : null;

          return (
            <div 
              key={index}
              className="flex items-center space-x-3 bg-muted/50 p-2 rounded-md"
            >
              <div className="flex-shrink-0">
                {IconComponent && <IconComponent className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{statusUpdate.status}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDateTime(statusUpdate.createdAt)}
                </p>
              </div>
              <div className="text-xs flex items-center">
                <User className="mr-1 h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{statusUpdate.updatedBy}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


import { BranchId } from "@/contexts/AuthContext";
import { TransferStatus } from "@/types/transfer";

export const useTransferStatus = (
  currentStatus: TransferStatus,
  isProvider: boolean,
  isRequester: boolean
) => {
  const getNextStatus = (): TransferStatus | null => {
    switch (currentStatus) {
      case "Solicitado":
        return isProvider ? "Em preparo" : null;
      case "Em preparo":
        return isProvider ? "Enviado" : null;
      case "Enviado":
        return isRequester ? "Concluído" : null;
      default:
        return null;
    }
  };

  const getStatusBadgeColor = (status: TransferStatus) => {
    switch (status) {
      case "Solicitado": return "bg-yellow-100 text-yellow-800";
      case "Em preparo": return "bg-blue-100 text-blue-800";
      case "Enviado": return "bg-purple-100 text-purple-800";
      case "Concluído": return "bg-green-100 text-green-800";
      default: return "";
    }
  };

  const getStatusIcon = (status: TransferStatus) => {
    switch (status) {
      case "Solicitado": return "AlertTriangle";
      case "Em preparo": return "ClipboardList";
      case "Enviado": return "Truck";
      case "Concluído": return "CheckCircle2";
      default: return null;
    }
  };

  return {
    getNextStatus,
    getStatusBadgeColor,
    getStatusIcon,
  };
};

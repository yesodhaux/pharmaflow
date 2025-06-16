
import { Transfer, StatusHistoryEntry } from "@/types/transfer";

export const formatTransferData = (
  rawTransfer: any,
  statusHistory: any[]
): Transfer => {
  const formattedHistory: StatusHistoryEntry[] = statusHistory.map((entry) => ({
    id: entry.id,
    status: entry.status,
    updatedBy: entry.updated_by,
    createdAt: entry.created_at,
  }));

  return {
    id: rawTransfer.id,
    fromBranch: rawTransfer.from_branch,
    toBranch: rawTransfer.to_branch,
    product: rawTransfer.product,
    productBarcode: rawTransfer.product_barcode,
    productInternalCode: rawTransfer.product_internal_code,
    quantity: rawTransfer.quantity,
    requestDate: rawTransfer.request_date,
    status: rawTransfer.status,
    statusHistory: formattedHistory,
    observations: rawTransfer.observations,
    danfeKey: rawTransfer.danfe_key,
    danfeFile: rawTransfer.danfe_url,
    product_image_url: rawTransfer.product_image_url,
  };
};

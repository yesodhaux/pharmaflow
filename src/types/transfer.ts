
export interface Transfer {
  id: string;
  fromBranch: string;
  toBranch: string;
  product: string;
  productBarcode?: string;
  productInternalCode?: string;
  quantity: number;
  requestDate: string;
  status: TransferStatus;
  statusHistory: StatusHistoryEntry[];
  observations?: string;
  danfeKey?: string;
  danfeFile?: string;
  product_image_url?: string;
}

export interface StatusHistoryEntry {
  id: string;
  status: TransferStatus;
  updatedBy: string;
  createdAt: string;
}

// Add the missing StatusUpdate type that StatusHistory component expects
export interface StatusUpdate {
  status: TransferStatus;
  timestamp: string;
  updatedBy: string;
}

export type TransferStatus = "Solicitado" | "Em preparo" | "Enviado" | "Concluído";

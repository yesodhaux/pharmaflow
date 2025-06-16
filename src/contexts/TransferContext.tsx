
import { createContext, useContext, ReactNode, useEffect } from "react";
import { Transfer, TransferStatus } from "@/types/transfer";
import { BranchId } from "./AuthContext";
import { useTransferOperations } from "@/hooks/useTransferOperations";

interface TransferContextType {
  transfers: Transfer[];
  loadTransfers: () => Promise<void>;
  createTransfer: (transfer: Omit<Transfer, "id" | "requestDate" | "status" | "statusHistory"> & { productImage?: File | null }) => Promise<boolean>;
  updateTransferStatus: (id: string, newStatus: TransferStatus, updatedBy: BranchId) => void;
  updateTransferDanfe: (id: string, danfeKey: string, danfeFile?: File | null) => void;
  updateProductImage: (id: string, imageFile: File) => Promise<void>;
  getTransfersForBranch: (branchId: BranchId) => Transfer[];
  getTransferById: (id: string) => Transfer | undefined;
}

const TransferContext = createContext<TransferContextType | undefined>(undefined);

interface TransferProviderProps {
  children: ReactNode;
}

export const TransferProvider = ({ children }: TransferProviderProps) => {
  const transferOperations = useTransferOperations();

  // Ensure the hook is properly initialized before providing context
  if (!transferOperations) {
    console.log('TransferOperations not yet initialized');
    return null;
  }

  const {
    transfers,
    loadTransfers,
    createTransfer,
    updateTransferStatus,
    updateTransferDanfe,
    updateProductImage,
    getTransfersForBranch,
    getTransferById,
  } = transferOperations;

  return (
    <TransferContext.Provider
      value={{
        transfers,
        loadTransfers,
        createTransfer,
        updateTransferStatus,
        updateTransferDanfe,
        updateProductImage,
        getTransfersForBranch,
        getTransferById,
      }}
    >
      {children}
    </TransferContext.Provider>
  );
};

export const useTransfer = () => {
  const context = useContext(TransferContext);
  if (context === undefined) {
    throw new Error("useTransfer must be used within a TransferProvider");
  }
  return context;
};

export type { Transfer, TransferStatus };

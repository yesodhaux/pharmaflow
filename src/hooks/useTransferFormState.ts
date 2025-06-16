
import { useState } from "react";
import { BranchId } from "@/contexts/AuthContext";

export const useTransferFormState = () => {
  const [toBranch, setToBranch] = useState<BranchId | "">("");
  const [product, setProduct] = useState("");
  const [scannedBarcode, setScannedBarcode] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState("");
  const [observations, setObservations] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [internalCode, setInternalCode] = useState("");

  return {
    toBranch,
    setToBranch,
    product,
    setProduct,
    scannedBarcode,
    setScannedBarcode,
    quantity,
    setQuantity,
    observations,
    setObservations,
    isSubmitting,
    setIsSubmitting,
    manualCode,
    setManualCode,
    internalCode,
    setInternalCode,
  };
};

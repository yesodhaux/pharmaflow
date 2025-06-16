import { useTransfer } from "@/contexts/TransferContext";
import { useAuth, BranchId } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast as sonnerToast } from "sonner";
import { validateTransferForm, TransferFormData } from "@/utils/transferValidation";
import { useTransferFormState } from "./useTransferFormState";
import { useProductSearch } from "./useProductSearch";
import { useProductImageHandling } from "./useProductImageHandling";

export const useTransferForm = () => {
  const { createTransfer } = useTransfer();
  const { currentBranch } = useAuth();
  const navigate = useNavigate();
  
  const {
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
  } = useTransferFormState();

  const {
    productImage,
    setProductImage,
    productImagePreview,
    setProductImagePreview,
    handleProductImageUpload,
  } = useProductImageHandling();

  const {
    searchingProduct,
    searchResults,
    isSearchResultsOpen,
    setIsSearchResultsOpen,
    loading,
    handleScan: searchHandleScan,
    handleScanWithSearch: searchHandleScanWithSearch,
    handleInternalCodeSearch: searchHandleInternalCodeSearch,
    handleNameSearch: searchHandleNameSearch,
    handleProductSelect: searchHandleProductSelect,
  } = useProductSearch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData: TransferFormData = {
      toBranch,
      product,
      quantity,
      observations
    };

    if (!validateTransferForm(formData) || !currentBranch) return;

    setIsSubmitting(true);

    try {
      const success = await createTransfer({
        fromBranch: currentBranch,
        toBranch: toBranch as BranchId,
        product,
        quantity: parseInt(quantity),
        observations,
        productImage,
      });

      if (success) {
        navigate("/dashboard");
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      sonnerToast.error("Erro", {
        description: "Houve um erro ao criar a transferência.",
      });
      setIsSubmitting(false);
    }
  };

  const handleScan = (barcode: string) => {
    searchHandleScan(barcode, setProduct, setScannedBarcode, setManualCode);
  };

  const handleScanWithSearch = async (barcode: string) => {
    await searchHandleScanWithSearch(
      barcode,
      setProduct,
      setScannedBarcode,
      setManualCode,
      setInternalCode,
      setProductImagePreview,
      setProductImage
    );
  };

  const handleInternalCodeSearch = async (code: string) => {
    await searchHandleInternalCodeSearch(
      code,
      setProduct,
      setScannedBarcode,
      setManualCode,
      setInternalCode,
      setProductImagePreview,
      setProductImage
    );
  };

  const handleNameSearch = async () => {
    await searchHandleNameSearch(product);
  };

  const handleProductSelect = async (selectedProduct: any) => {
    await searchHandleProductSelect(
      selectedProduct,
      setProduct,
      setInternalCode,
      setScannedBarcode,
      setManualCode,
      setProductImagePreview,
      setProductImage
    );
  };

  return {
    toBranch,
    setToBranch,
    product,
    setProduct,
    scannedBarcode,
    quantity,
    setQuantity,
    observations,
    setObservations,
    isSubmitting,
    searchingProduct,
    manualCode,
    setManualCode,
    internalCode,
    setInternalCode,
    searchResults,
    isSearchResultsOpen,
    setIsSearchResultsOpen,
    productImagePreview,
    loading,
    handleSubmit,
    handleProductImageUpload,
    handleScan,
    handleScanWithSearch,
    handleInternalCodeSearch,
    handleNameSearch,
    handleProductSelect,
  };
};

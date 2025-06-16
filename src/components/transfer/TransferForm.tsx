
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FormHeader } from "./FormHeader";
import { BranchSelection } from "./BranchSelection";
import { ProductQuantitySection } from "./ProductQuantitySection";
import { ObservationsSection } from "./ObservationsSection";
import { FormActions } from "./FormActions";
import { ProductSearchResultsDialog } from "./ProductSearchResultsDialog";
import { useTransferForm } from "@/hooks/useTransferForm";

export const TransferForm = () => {
  const {
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
  } = useTransferForm();

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <FormHeader />
        <CardContent className="space-y-6">
          <BranchSelection 
            toBranch={toBranch}
            setToBranch={setToBranch}
          />

          <ProductQuantitySection
            product={product}
            setProduct={setProduct}
            scannedBarcode={scannedBarcode}
            quantity={quantity}
            setQuantity={setQuantity}
            onScan={handleScan}
            onScanWithSearch={handleScanWithSearch}
            loading={loading}
            searchingProduct={searchingProduct}
            manualCode={manualCode}
            setManualCode={setManualCode}
            internalCode={internalCode}
            setInternalCode={setInternalCode}
            onInternalCodeSearch={handleInternalCodeSearch}
            onNameSearch={handleNameSearch}
            productImagePreview={productImagePreview}
            onProductImageUpload={handleProductImageUpload}
          />

          <ObservationsSection
            observations={observations}
            setObservations={setObservations}
          />
        </CardContent>
        <FormActions isSubmitting={isSubmitting} />
      </form>
      <ProductSearchResultsDialog
        open={isSearchResultsOpen}
        onOpenChange={setIsSearchResultsOpen}
        results={searchResults}
        onSelectProduct={handleProductSelect}
        loading={searchingProduct}
      />
    </Card>
  );
};

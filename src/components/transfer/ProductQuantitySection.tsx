
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductInput } from "./ProductInput";

interface ProductQuantitySectionProps {
  product: string;
  setProduct: (value: string) => void;
  scannedBarcode?: string;
  quantity: string;
  setQuantity: (value: string) => void;
  onScan: (barcode: string) => void;
  onScanWithSearch: (barcode: string) => Promise<void>;
  loading: boolean;
  searchingProduct: boolean;
  manualCode: string;
  setManualCode: (value: string) => void;
  internalCode: string;
  setInternalCode: (value: string) => void;
  onInternalCodeSearch: (code: string) => Promise<void>;
  onNameSearch: () => Promise<void>;
  productImagePreview: string | null;
  onProductImageUpload: (file: File) => void;
}

export const ProductQuantitySection = ({
  product,
  setProduct,
  scannedBarcode,
  quantity,
  setQuantity,
  onScan,
  onScanWithSearch,
  loading,
  searchingProduct,
  manualCode,
  setManualCode,
  internalCode,
  setInternalCode,
  onInternalCodeSearch,
  onNameSearch,
  productImagePreview,
  onProductImageUpload,
}: ProductQuantitySectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProductInput
        product={product}
        setProduct={setProduct}
        scannedBarcode={scannedBarcode}
        onScan={onScan}
        onScanWithSearch={onScanWithSearch}
        loading={loading}
        searchingProduct={searchingProduct}
        manualCode={manualCode}
        setManualCode={setManualCode}
        internalCode={internalCode}
        setInternalCode={setInternalCode}
        onInternalCodeSearch={onInternalCodeSearch}
        onNameSearch={onNameSearch}
        productImagePreview={productImagePreview}
        onProductImageUpload={onProductImageUpload}
      />

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantidade</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          placeholder="Quantidade"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
    </div>
  );
};

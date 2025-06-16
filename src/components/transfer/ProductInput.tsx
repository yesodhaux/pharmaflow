
import React from "react";
import { Label } from "@/components/ui/label";
import BarcodeScanner from "@/components/scanner/BarcodeScanner";
import { ProductImage } from "./ProductImage";
import { SearchableInput } from "./SearchableInput";

interface ProductInputProps {
  product: string;
  setProduct: (value: string) => void;
  scannedBarcode?: string;
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

export const ProductInput = ({
  product,
  setProduct,
  scannedBarcode,
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
}: ProductInputProps) => {
  const handleManualSearch = async () => {
    if (!manualCode.trim()) return;
    
    console.log("🔍 Busca manual iniciada com código:", manualCode);
    await onScanWithSearch(manualCode.trim());
  };

  const handleInternalSearch = async () => {
    if (!internalCode.trim()) return;
    
    console.log("🔍 Busca por código interno iniciada com:", internalCode);
    await onInternalCodeSearch(internalCode.trim());
  };
  
  const finalImageUrl = productImagePreview || (scannedBarcode ? `https://cdn-cosmos.bluesoft.com.br/products/${scannedBarcode}` : undefined);

  return (
    <div className="space-y-2">
      <Label htmlFor="product">Produto</Label>
      
      <ProductImage
        imageUrl={finalImageUrl}
        productName={product || "Produto"}
        onImageUpload={onProductImageUpload}
      />
      
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SearchableInput
            id="product"
            placeholder="Nome do medicamento"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            onSearch={onNameSearch}
            disabled={loading || searchingProduct}
            aria-label="Buscar produto por nome"
          />
        </div>
        <BarcodeScanner 
          onScan={onScan} 
          onScanWithSearch={onScanWithSearch}
        />
      </div>
      
      <SearchableInput
        placeholder="Digite o código de barras"
        value={manualCode}
        onChange={(e) => setManualCode(e.target.value)}
        onSearch={handleManualSearch}
        disabled={loading || searchingProduct}
        aria-label="Buscar produto por código"
        className="mt-2"
      />

      <SearchableInput
        placeholder="Digite o código interno"
        value={internalCode}
        onChange={(e) => setInternalCode(e.target.value)}
        onSearch={handleInternalSearch}
        disabled={loading || searchingProduct}
        aria-label="Buscar produto por código interno"
        className="mt-2"
      />
      
      {(loading || searchingProduct) && (
        <p className="text-xs text-muted-foreground">Buscando informações do produto...</p>
      )}
    </div>
  );
};

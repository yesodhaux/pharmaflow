
import { useState } from "react";
import { toast as sonnerToast } from "sonner";
import { useMedicineSearch, MedicineResult } from "@/hooks/useMedicineSearch";
import { findLatestProductImageUrl } from "@/api/transferApi";

export const useProductSearch = () => {
  const { searchMedicine, loading } = useMedicineSearch();
  const [searchingProduct, setSearchingProduct] = useState(false);
  const [searchResults, setSearchResults] = useState<MedicineResult[]>([]);
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false);

  const handleScan = (barcode: string, setProduct: (value: string) => void, setScannedBarcode: (value: string | undefined) => void, setManualCode: (value: string) => void) => {
    console.log("📱 ProductSearch - Código recebido no handleScan:", barcode);
    const cleanBarcode = barcode.trim();
    setProduct(cleanBarcode);
    setScannedBarcode(cleanBarcode);
    setManualCode(cleanBarcode);
  };

  const handleScanWithSearch = async (
    barcode: string,
    setProduct: (value: string) => void,
    setScannedBarcode: (value: string | undefined) => void,
    setManualCode: (value: string) => void,
    setInternalCode: (value: string) => void,
    setProductImagePreview: (value: string | null) => void,
    setProductImage: (value: File | null) => void
  ) => {
    console.log("📱 ProductSearch - Código recebido no handleScanWithSearch:", barcode);
    
    if (!barcode || barcode.trim() === "") {
      console.error("❌ Código de barras vazio recebido");
      return;
    }

    const cleanBarcode = barcode.trim();
    setSearchingProduct(true);
    setScannedBarcode(cleanBarcode);
    setManualCode(cleanBarcode);
    
    sonnerToast.info("Buscando produto...", {
      description: `Código: ${cleanBarcode}`,
    });

    try {
      console.log("📱 ProductSearch - Chamando searchMedicine com:", cleanBarcode);
      const medicineResults = await searchMedicine(cleanBarcode, 'codbarras');
      
      if (medicineResults && medicineResults.length > 0) {
        const medicine = medicineResults[0];
        console.log("✅ ProductSearch - Produto encontrado, definindo:", medicine.nome);
        setProduct(medicine.nome);
        setInternalCode(medicine.codinterno);
        
        // Busca imagem de transferências anteriores para este produto
        console.log("🖼️ Buscando imagem de transferências anteriores para:", medicine.nome);
        const savedImageUrl = await findLatestProductImageUrl(medicine.nome);
        if (savedImageUrl) {
          console.log("✅ Imagem encontrada de transferência anterior:", savedImageUrl);
          setProductImagePreview(savedImageUrl);
        } else {
          console.log("❌ Nenhuma imagem encontrada em transferências anteriores");
          setProductImagePreview(null);
        }
        setProductImage(null);
      } else {
        console.log("❌ ProductSearch - Nenhum produto encontrado, mantendo código de barras");
        setProduct(cleanBarcode);
        setProductImagePreview(null);
        setProductImage(null);
      }
    } catch (error) {
      console.error("❌ ProductSearch - Erro na busca do produto:", error);
      setProduct(cleanBarcode);
      setProductImagePreview(null);
      setProductImage(null);
      
      sonnerToast.error("Erro ao buscar dados do produto", {
        description: "Mantendo o código de barras no campo",
      });
    } finally {
      setSearchingProduct(false);
    }
  };

  const handleInternalCodeSearch = async (
    code: string,
    setProduct: (value: string) => void,
    setScannedBarcode: (value: string | undefined) => void,
    setManualCode: (value: string) => void,
    setInternalCode: (value: string) => void,
    setProductImagePreview: (value: string | null) => void,
    setProductImage: (value: File | null) => void
  ) => {
    console.log("📱 ProductSearch - Código recebido no handleInternalCodeSearch:", code);
    
    if (!code || code.trim() === "") {
      console.error("❌ Código interno vazio recebido");
      return;
    }

    const cleanCode = code.trim();
    setSearchingProduct(true);
    setInternalCode(cleanCode);
    
    sonnerToast.info("Buscando produto...", {
      description: `Código Interno: ${cleanCode}`,
    });

    try {
      console.log("📱 ProductSearch - Chamando searchMedicine com código interno:", cleanCode);
      const medicineResults = await searchMedicine(cleanCode, 'codinterno');
      
      if (medicineResults && medicineResults.length > 0) {
        const medicine = medicineResults[0];
        console.log("✅ ProductSearch - Produto encontrado (cod. interno), definindo:", medicine.nome);
        setProduct(medicine.nome);
        setScannedBarcode(medicine.codbarras);
        setManualCode(medicine.codbarras);
        setInternalCode(medicine.codinterno);
        
        // Busca imagem de transferências anteriores para este produto
        console.log("🖼️ Buscando imagem de transferências anteriores para:", medicine.nome);
        const savedImageUrl = await findLatestProductImageUrl(medicine.nome);
        if (savedImageUrl) {
          console.log("✅ Imagem encontrada de transferência anterior:", savedImageUrl);
          setProductImagePreview(savedImageUrl);
        } else {
          console.log("❌ Nenhuma imagem encontrada em transferências anteriores");
          setProductImagePreview(null);
        }
        setProductImage(null);
      } else {
        console.log("❌ ProductSearch - Nenhum produto encontrado (cod. interno), mantendo código");
        setProduct(cleanCode);
        setProductImagePreview(null);
        setProductImage(null);
      }
    } catch (error) {
      console.error("❌ ProductSearch - Erro na busca do produto (cod. interno):", error);
      setProduct(cleanCode);
      setProductImagePreview(null);
      setProductImage(null);
      
      sonnerToast.error("Erro ao buscar dados do produto", {
        description: "Mantendo o código interno no campo do produto",
      });
    } finally {
      setSearchingProduct(false);
    }
  };

  const handleNameSearch = async (product: string) => {
    if (!product.trim()) {
      sonnerToast.warning("Campo de busca vazio", {
        description: "Por favor, digite o nome de um produto para buscar.",
      });
      return;
    }

    setSearchingProduct(true);
    setIsSearchResultsOpen(true);
    setSearchResults([]);

    try {
      const results = await searchMedicine(product, 'nome');
      if (results && results.length > 0) {
        setSearchResults(results);
      } else {
        setIsSearchResultsOpen(false);
      }
    } catch (error) {
      console.error("❌ ProductSearch - Erro na busca por nome:", error);
      setIsSearchResultsOpen(false);
    } finally {
      setSearchingProduct(false);
    }
  };

  const handleProductSelect = async (
    selectedProduct: MedicineResult,
    setProduct: (value: string) => void,
    setInternalCode: (value: string) => void,
    setScannedBarcode: (value: string | undefined) => void,
    setManualCode: (value: string) => void,
    setProductImagePreview: (value: string | null) => void,
    setProductImage: (value: File | null) => void
  ) => {
    setProduct(selectedProduct.nome);
    setInternalCode(selectedProduct.codinterno);
    const barcode = selectedProduct.codbarras;
    setScannedBarcode(barcode);
    setManualCode(barcode);
    
    // Busca a imagem mais recente para o produto selecionado
    setProductImage(null);
    console.log("🖼️ Buscando imagem de transferências anteriores para produto selecionado:", selectedProduct.nome);
    const imageUrl = await findLatestProductImageUrl(selectedProduct.nome);
    if (imageUrl) {
      console.log("✅ Imagem encontrada de transferência anterior:", imageUrl);
    } else {
      console.log("❌ Nenhuma imagem encontrada em transferências anteriores");
    }
    setProductImagePreview(imageUrl);
    
    setIsSearchResultsOpen(false);
  };

  return {
    searchingProduct,
    searchResults,
    isSearchResultsOpen,
    setIsSearchResultsOpen,
    loading,
    handleScan,
    handleScanWithSearch,
    handleInternalCodeSearch,
    handleNameSearch,
    handleProductSelect,
  };
};


import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export interface MedicineResult {
  codbarras: string;
  codinterno: string;
  nome: string;
}

interface SearchResponse {
  resultados: MedicineResult[];
}

type SearchField = "codbarras" | "codinterno" | "nome";

export const useMedicineSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchInSupabase = async (value: string, field: SearchField): Promise<MedicineResult[] | null> => {
    let data;
    let dbError;

    if (field === 'nome') {
      // Usando a função RPC para busca por similaridade no nome
      const { data: rpcData, error: rpcError } = await supabase.rpc('search_medicines_by_name', {
        search_term: value
      });
      data = rpcData;
      dbError = rpcError;
      console.log("🔍 Resposta do Supabase (RPC com busca inteligente):", data);
    } else {
      // Mantendo a busca exata para código de barras e código interno
      const { data: queryData, error: queryError } = await supabase
        .from('medicines')
        .select('codbarras, codinterno, nome')
        .eq(field, value);
      data = queryData;
      dbError = queryError;
      console.log("🔍 Resposta do Supabase (Query por código):", data);
    }
    
    if (dbError) {
      throw new Error(`Erro ao buscar no Supabase: ${dbError.message}`);
    }
    
    if (!data || data.length === 0) return null;
    
    // Retorna os resultados sem buscar imagens
    return data.map((item) => ({
      codbarras: item.codbarras,
      codinterno: item.codinterno || '',
      nome: item.nome,
    }));
  };

  const searchInApi = async (value: string, field: SearchField): Promise<MedicineResult[] | null> => {
    const apiUrl = `https://codigos-elbs.onrender.com/buscar?valor=${encodeURIComponent(value)}&campo=${field}`;
    console.log("🔍 URL da API:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
    
    const textResponse = await response.text();
    
    try {
      const data = JSON.parse(textResponse) as SearchResponse;
      if (!data || !data.resultados || data.resultados.length === 0) return null;
      
      // Retorna os resultados da API sem buscar imagens
      return data.resultados.map((item) => ({
        codbarras: item.codbarras,
        codinterno: item.codinterno || '',
        nome: item.nome,
      }));
    } catch (e) {
      console.error("Erro ao parsear JSON da API", e);
      throw new Error("Resposta inválida da API.");
    }
  };

  const searchMedicine = async (value: string, field: SearchField): Promise<MedicineResult[] | null> => {
    const searchSource = localStorage.getItem('searchSource') || 'supabase';
    console.log(`🔍 Fonte: ${searchSource}, Valor: ${value}, Campo: ${field}`);
    
    if (!value || !value.trim()) {
      console.error(`❌ Valor inválido para o campo ${field}`);
      return null;
    }
    
    const cleanValue = value.trim();
    setLoading(true);
    setError(null);
    
    try {
      const medicines = searchSource === 'supabase'
        ? await searchInSupabase(cleanValue, field)
        : await searchInApi(cleanValue, field);

      if (!medicines) {
        toast({
          title: "Produto não encontrado",
          description: `Nenhum medicamento encontrado para este critério.`,
          variant: "destructive",
        });
        return null;
      }
      
      console.log(`✅ ${medicines.length} medicamento(s) encontrado(s)`);
      
      if (field !== 'nome') {
          toast({ title: "Produto encontrado", description: medicines[0].nome });
      } else {
        toast({ title: "Busca concluída", description: `${medicines.length} produto(s) encontrado(s).` });
      }

      return medicines;
    } catch (err) {
      console.error("❌ Erro ao buscar medicamento:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar o medicamento.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const getProductImage = async (barcode: string): Promise<string | null> => {
    console.log("🖼️ Buscando imagem do produto para código:", barcode);
    
    if (!barcode || !barcode.trim()) {
      console.log("❌ Código de barras inválido para busca de imagem");
      return null;
    }
    
    const cleanBarcode = barcode.trim();
    
    // Apenas tenta a API externa para imagens
    const imageUrl = `https://cdn-cosmos.bluesoft.com.br/products/${cleanBarcode}`;
    
    try {
      const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
      if (imageResponse.ok) {
        console.log("✅ Imagem do produto encontrada na API externa:", imageUrl);
        return imageUrl;
      } else {
        console.log("❌ Imagem do produto não encontrada para código:", cleanBarcode);
        return null;
      }
    } catch (imageError) {
      console.log("❌ Erro ao verificar imagem:", imageError);
      return null;
    }
  };
  
  return {
    searchMedicine,
    getProductImage,
    loading,
    error
  };
};


import { toast } from "@/hooks/use-toast";

export interface TransferFormData {
  toBranch: string;
  product: string;
  quantity: string;
  observations: string;
}

export const validateTransferForm = (data: TransferFormData): boolean => {
  if (!data.toBranch) {
    toast({
      title: "Erro de validação",
      description: "Selecione a filial de destino",
      variant: "destructive",
    });
    return false;
  }

  if (!data.product.trim()) {
    toast({
      title: "Erro de validação",
      description: "Informe o produto a ser solicitado",
      variant: "destructive",
    });
    return false;
  }

  const quantityValue = parseInt(data.quantity);
  if (isNaN(quantityValue) || quantityValue <= 0) {
    toast({
      title: "Erro de validação",
      description: "Informe uma quantidade válida (maior que zero)",
      variant: "destructive",
    });
    return false;
  }

  return true;
};


import { useEffect, useState } from "react";
import { Calendar, FileText, Download, Package } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Transfer } from "@/types/transfer";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/transfer/ProductImage";
import { supabase } from "@/integrations/supabase/client";

interface TransferDetailsProps {
  transfer: Transfer;
}

export const TransferDetails = ({ transfer }: TransferDetailsProps) => {
  const [cosmosImageUrl, setCosmosImageUrl] = useState<string | null>(null);
  const [isFetchingImage, setIsFetchingImage] = useState(true);

  useEffect(() => {
    const findBarcodeAndSetUrl = async () => {
      setIsFetchingImage(true);
      if (transfer.product) {
        const { data: results, error } = await supabase.rpc(
          "search_medicines_by_name",
          {
            search_term: transfer.product,
          }
        );

        if (error) {
          console.error("Error fetching product barcode for image:", error);
          setCosmosImageUrl(null);
        } else if (results && results.length > 0 && results[0].codbarras) {
          setCosmosImageUrl(`https://cdn-cosmos.bluesoft.com.br/products/${results[0].codbarras}`);
        } else {
          setCosmosImageUrl(null);
        }
      } else {
        setCosmosImageUrl(null);
      }
      setIsFetchingImage(false);
    };

    if (!transfer.product_image_url) {
      findBarcodeAndSetUrl();
    } else {
        setIsFetchingImage(false);
    }
  }, [transfer.product, transfer.product_image_url]);

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  };

  const finalImageUrl = transfer.product_image_url || cosmosImageUrl;

  return (
    <div className="space-y-6">
      {!isFetchingImage && (
        <ProductImage
          imageUrl={finalImageUrl}
          productName={transfer.product}
          transferId={transfer.id}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Filial Solicitante</p>
          <p className="font-medium">{transfer.fromBranch}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Filial Fornecedora</p>
          <p className="font-medium">{transfer.toBranch}</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-medium">Informações do Produto</p>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Nome do Produto</p>
              <p className="font-medium text-lg">{transfer.product}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transfer.productBarcode && (
                <div>
                  <p className="text-sm text-muted-foreground">Código de Barras</p>
                  <p className="font-mono text-sm bg-background px-2 py-1 rounded border inline-block">
                    {transfer.productBarcode}
                  </p>
                </div>
              )}
              
              {transfer.productInternalCode && (
                <div>
                  <p className="text-sm text-muted-foreground">Código Interno</p>
                  <p className="font-mono text-sm bg-background px-2 py-1 rounded border inline-block">
                    {transfer.productInternalCode}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-8">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Quantidade</p>
            <p className="font-medium">{transfer.quantity}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Data da Solicitação</p>
            <p className="font-medium flex items-center">
              <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
              {formatDateTime(transfer.requestDate)}
            </p>
          </div>
        </div>
        
        {transfer.observations && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Observações</p>
            <p className="bg-muted p-3 rounded-md text-sm">{transfer.observations}</p>
          </div>
        )}
      </div>
      
      {transfer.danfeKey && (
        <div className="space-y-2 bg-secondary/50 p-3 rounded-md">
          <p className="text-sm font-medium flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Informações da DANFE
          </p>
          <p className="text-sm break-all">
            <span className="text-muted-foreground">Chave de acesso: </span>
            {transfer.danfeKey}
          </p>
          {typeof transfer.danfeFile === 'string' && transfer.danfeFile && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 flex items-center text-blue-600"
              asChild
            >
              <a href={transfer.danfeFile} target="_blank" rel="noopener noreferrer">
                <Download className="mr-1 h-4 w-4" />
                Baixar DANFE
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

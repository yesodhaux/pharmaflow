
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";
import BarcodeScanner from "@/components/scanner/BarcodeScanner";

interface DanfeInputProps {
  danfeKey: string;
  setDanfeKey: (value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DanfeInput = ({ danfeKey, setDanfeKey, handleFileChange }: DanfeInputProps) => {
  const [fileSelected, setFileSelected] = useState<string | null>(null);
  
  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("O arquivo é muito grande", {
          description: "O tamanho máximo permitido é 5MB"
        });
        e.target.value = '';
        setFileSelected(null);
        return;
      }
      
      setFileSelected(file.name);
    } else {
      setFileSelected(null);
    }
    
    handleFileChange(e);
  };

  const handleBarcodeScan = (scannedCode: string) => {
    console.log("📄 Código DANFE escaneado:", scannedCode);
    setDanfeKey(scannedCode);
    toast.success("Código escaneado", {
      description: "A chave de acesso foi preenchida automaticamente"
    });
  };
  
  return (
    <div className="w-full space-y-4">
      <Separator />
      <div className="space-y-2">
        <Label htmlFor="danfeKey" className="text-sm font-medium">
          Chave de Acesso da DANFE <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-2">
          <Input
            id="danfeKey"
            placeholder="Informe a chave de acesso da DANFE"
            value={danfeKey}
            onChange={(e) => setDanfeKey(e.target.value)}
            required
            className="flex-1"
          />
          <BarcodeScanner onScan={handleBarcodeScan} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="danfeFile" className="text-sm font-medium">
          Arquivo da DANFE (opcional)
        </Label>
        <Input
          id="danfeFile"
          type="file"
          onChange={handleLocalFileChange}
          accept=".pdf,.xml"
        />
        {fileSelected && (
          <p className="text-xs text-green-600 mt-1">
            Arquivo selecionado: {fileSelected}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Formatos aceitos: PDF, XML. Tamanho máximo: 5MB
        </p>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { Dialog } from "@/components/ui/dialog";
import { ScanButton } from './ScanButton';
import { ScannerDialog } from './ScannerDialog';
import { useBarcodeScannerCamera } from '@/hooks/useBarcodeScannerCamera';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onScanWithSearch?: (barcode: string) => Promise<void>;
}

const BarcodeScanner = ({ onScan, onScanWithSearch }: BarcodeScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuccessfulScan = async (result: string) => {
    console.log("🔍 Código de barras escaneado:", result);
    
    const barcode = result.trim();
    console.log("🔍 Código de barras processado:", barcode);
    
    setIsOpen(false);
    setScanning(false);
    
    // Sempre chama o callback padrão primeiro
    onScan(barcode);
    
    // Se tiver callback de busca, executa a busca
    if (onScanWithSearch) {
      console.log("🔍 Iniciando busca na API para:", barcode);
      try {
        await onScanWithSearch(barcode);
        console.log("✅ Busca na API concluída com sucesso");
      } catch (error) {
        console.error("❌ Erro na busca da API:", error);
      }
    }
  };

  const { videoRef, cleanupCamera } = useBarcodeScannerCamera({
    onScan: handleSuccessfulScan,
    isOpen,
    setScanning,
    setError
  });

  const handleScanClick = () => {
    console.log("🔍 Botão de scan clicado");
    setIsOpen(true);
  };

  const handleDialogClose = () => {
    console.log("🔍 Dialog fechado");
    setIsOpen(false);
    setScanning(false);
    setError(null);
    cleanupCamera();
  };

  return (
    <>
      <ScanButton onClick={handleScanClick} />
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <ScannerDialog
          videoRef={videoRef}
          scanning={scanning}
          error={error}
          onClose={handleDialogClose}
        />
      </Dialog>
    </>
  );
};

export default BarcodeScanner;

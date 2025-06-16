
import { useRef, useCallback } from 'react';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';

interface UseBarcodeDetectionProps {
  onScan: (result: string) => void;
  onError: (error: string) => void;
}

export const useBarcodeDetection = ({ onScan, onError }: UseBarcodeDetectionProps) => {
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const hasScanned = useRef(false);
  const isDetecting = useRef(false);

  const initializeReader = useCallback(() => {
    const hints = new Map();
    hints.set(DecodeHintType.TRY_HARDER, true);
    hints.set(DecodeHintType.PURE_BARCODE, false);
    
    // Formatos de código de barras mais comuns
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.QR_CODE
    ]);
    
    codeReaderRef.current = new BrowserMultiFormatReader(hints);
    console.log("📱 Reader inicializado");
  }, []);

  const startDetection = useCallback(async (deviceId: string, videoElement: HTMLVideoElement) => {
    if (!codeReaderRef.current) {
      initializeReader();
    }

    if (isDetecting.current) {
      console.log("🔍 Detecção já em andamento");
      return;
    }

    try {
      console.log("🔍 Iniciando detecção...");
      isDetecting.current = true;
      hasScanned.current = false;
      
      await codeReaderRef.current!.decodeFromVideoDevice(
        deviceId,
        videoElement,
        (result, err) => {
          if (result && !hasScanned.current) {
            console.log("✅ Código detectado:", result.getText());
            hasScanned.current = true;
            isDetecting.current = false;
            onScan(result.getText());
          }
          
          // Não loga erros normais de tentativa
          if (err && !hasScanned.current && err.message && 
              !err.message.includes('No MultiFormat Readers') &&
              !err.message.includes('NotFoundException')) {
            console.log("🔍 Erro na detecção:", err.message);
          }
        }
      );
      
    } catch (error) {
      console.error("❌ Erro no processo de decodificação:", error);
      isDetecting.current = false;
      
      if (!hasScanned.current) {
        onError('Erro ao iniciar scanner. Verifique se a câmera está funcionando.');
      }
    }
  }, [onScan, onError, initializeReader]);

  const resetScanState = useCallback(() => {
    hasScanned.current = false;
    isDetecting.current = false;
    console.log("🔄 Estado de scan resetado");
  }, []);

  const stopDetection = useCallback(() => {
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
        console.log("🛑 Detecção parada");
      } catch (error) {
        console.warn("⚠️ Erro ao parar detecção:", error);
      }
    }
    isDetecting.current = false;
  }, []);

  return {
    startDetection,
    resetScanState,
    stopDetection,
    hasScanned,
    initializeReader
  };
};

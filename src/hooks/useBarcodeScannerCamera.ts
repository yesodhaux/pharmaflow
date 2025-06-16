
import { useRef, useEffect } from 'react';
import { useCameraAccess } from './useCameraAccess';
import { useBarcodeDetection } from './useBarcodeDetection';
import { cleanupVideoElement, cleanupTimeouts, cleanupIntervals } from '@/utils/cameraCleanup';

interface UseBarcodeScanner {
  onScan: (result: string) => void;
  isOpen: boolean;
  setScanning: (scanning: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBarcodeScannerCamera = ({ onScan, isOpen, setScanning, setError }: UseBarcodeScanner) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { getAvailableCameras, selectBestCamera, initializeVideoStream, attemptRef } = useCameraAccess();
  
  const { startDetection, resetScanState, hasScanned, initializeReader } = useBarcodeDetection({
    onScan: (result) => {
      setScanning(false);
      cleanupCamera();
      onScan(result);
    },
    onError: setError
  });

  useEffect(() => {
    initializeReader();
    return () => cleanupCamera();
  }, [initializeReader]);

  useEffect(() => {
    if (isOpen) {
      scanTimeoutRef.current = setTimeout(() => {
        startScanning();
      }, 500);
    } else {
      cleanupCamera();
    }
    
    return () => {
      cleanupTimeouts(scanTimeoutRef.current);
    };
  }, [isOpen]);

  const startScanning = async () => {
    setError(null);
    setScanning(true);
    resetScanState();

    cleanupTimeouts(scanTimeoutRef.current, scanIntervalRef.current);
    scanTimeoutRef.current = null;
    scanIntervalRef.current = null;

    try {
      const cameras = await getAvailableCameras();
      const selectedDeviceId = selectBestCamera(cameras);
      
      const selectedCamera = cameras.find(c => c.deviceId === selectedDeviceId);
      console.log(`Tentativa ${attemptRef.current}: Usando câmera: ${selectedCamera?.label}`);

      if (!videoRef.current) {
        setError('Erro ao inicializar vídeo.');
        setScanning(false);
        return;
      }

      await initializeVideoStream(selectedDeviceId, videoRef.current);
      await startDetection(selectedDeviceId, videoRef.current);
      
      // Setup retry logic for multiple cameras
      if (cameras.length > 1) {
        scanTimeoutRef.current = setTimeout(() => {
          if (!hasScanned.current && isOpen) {
            console.log("Retrying with different camera...");
            startScanning();
          }
        }, 8000);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      
      if (err instanceof Error && err.message.includes('Nenhuma câmera')) {
        setError(err.message);
      } else {
        setError('Erro ao acessar câmera. Verifique as permissões.');
      }
      
      setScanning(false);
      
      // Retry logic for permission issues
      if (attemptRef.current <= 2 && isOpen) {
        scanTimeoutRef.current = setTimeout(() => {
          if (isOpen && !hasScanned.current) {
            startScanning();
          }
        }, 1500);
      }
    }
  };

  const cleanupCamera = () => {
    try {
      cleanupTimeouts(scanTimeoutRef.current);
      cleanupIntervals(scanIntervalRef.current);
      
      scanTimeoutRef.current = null;
      scanIntervalRef.current = null;
      
      cleanupVideoElement(videoRef.current);
      initializeReader();
    } catch (e) {
      console.error("Error releasing camera:", e);
    }
  };

  return {
    videoRef,
    cleanupCamera,
    startScanning,
  };
};

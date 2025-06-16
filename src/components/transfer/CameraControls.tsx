
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Camera, RefreshCcw, Upload, Loader2 } from 'lucide-react';

interface CameraControlsProps {
  capturedImage: string | null;
  isCameraReady: boolean;
  isInitializing: boolean;
  isSubmitting: boolean;
  onCapture: () => void;
  onReset: () => void;
  onConfirm: () => void;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  capturedImage,
  isCameraReady,
  isInitializing,
  isSubmitting,
  onCapture,
  onReset,
  onConfirm,
}) => {
  return (
    <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
      {capturedImage ? (
        <>
          <Button variant="outline" onClick={onReset} disabled={isSubmitting}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Tentar Novamente
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : <><Upload className="mr-2 h-4 w-4" /> Confirmar</>}
          </Button>
        </>
      ) : (
        <Button onClick={onCapture} className="w-full" disabled={!isCameraReady || isInitializing}>
          {!isCameraReady ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isInitializing ? "Iniciando..." : "Carregando Câmera..."}
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" /> Capturar Foto
            </>
          )}
        </Button>
      )}
    </DialogFooter>
  );
};

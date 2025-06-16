
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ScannerDialogProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  scanning: boolean;
  error: string | null;
  onClose: () => void;
}

export const ScannerDialog = ({ videoRef, scanning, error, onClose }: ScannerDialogProps) => {
  return (
    <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-hidden">
      <DialogHeader>
        <DialogTitle>Scanner de Código de Barras</DialogTitle>
        <DialogDescription>
          Posicione o código de barras em frente à câmera.
        </DialogDescription>
      </DialogHeader>
      <div className="relative min-h-[320px] bg-muted rounded-md flex flex-col items-center justify-center overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            className="rounded-md object-cover w-full h-full max-h-[400px]"
            style={{ 
              minHeight: '320px',
              transform: 'scaleX(1)'
            }}
            autoPlay
            muted
            playsInline
            webkit-playsinline="true"
          />
          
          {/* Indicador de status simples */}
          <div className="absolute top-2 left-2 right-2">
            {scanning && !error && (
              <div className="bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-medium text-center">
                🔍 Escaneando...
              </div>
            )}
            {error && (
              <div className="bg-red-500/90 text-white px-3 py-1 rounded-full text-sm font-medium text-center">
                ❌ {error}
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center text-muted-foreground mt-3 px-4">
          {scanning && !error && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Escaneando código de barras...</p>
              <p className="text-xs opacity-75">
                Posicione o código claramente na frente da câmera
              </p>
            </div>
          )}
          {error && (
            <div className="space-y-2">
              <p className="text-sm text-red-600 font-medium">{error}</p>
              <p className="text-xs opacity-75">
                Tente posicionar melhor o código ou feche e abra novamente
              </p>
            </div>
          )}
        </div>
      </div>
      <Button variant="outline" type="button" className="mt-2 w-full" onClick={onClose}>
        Fechar Scanner
      </Button>
    </DialogContent>
  );
};

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCameraAccess } from '@/hooks/useCameraAccess';
import { CameraControls } from './CameraControls';

interface CameraDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImageCapture: (file: File) => Promise<void>;
}

export const CameraDialog: React.FC<CameraDialogProps> = ({ 
  isOpen, 
  onClose, 
  onImageCapture 
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initializationRef = useRef<boolean>(false);
  
  const { getAvailableCameras, selectBestCamera, initializeVideoStream } = useCameraAccess();

  const closeCamera = useCallback(() => {
    console.log("🔒 Fechando câmera...");
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
        console.log("🛑 Track parada:", track.kind);
      });
      videoRef.current.srcObject = null;
    }
    setCapturedImage(null);
    setIsCameraReady(false);
    setIsInitializing(false);
    initializationRef.current = false;
    onClose();
  }, [onClose]);

  const startCamera = useCallback(async () => {
    if (initializationRef.current || !videoRef.current || capturedImage) {
      console.log("⏭️ Pulando inicialização da câmera - já em progresso ou capturada");
      return;
    }
    
    console.log("🚀 Iniciando câmera...");
    initializationRef.current = true;
    setIsInitializing(true);
    setIsCameraReady(false);
    
    try {
      console.log("📱 Obtendo câmeras disponíveis...");
      const cameras = await getAvailableCameras();
      console.log("📱 Câmeras obtidas:", cameras.length);
      
      const deviceId = selectBestCamera(cameras);
      console.log("🎯 Câmera selecionada:", deviceId);
      
      console.log("🎬 Inicializando stream de vídeo...");
      await initializeVideoStream(deviceId, videoRef.current);
      console.log("✅ Stream inicializada com sucesso");
      
      setIsCameraReady(true);
      toast.success("Câmera pronta!", {
        description: "Agora você pode capturar a foto."
      });
      
    } catch (err) {
      console.error("❌ Erro ao inicializar câmera:", err);
      let errorMessage = "Não foi possível acessar a câmera.";
      
      if (err instanceof Error) {
        if (err.message.includes('Permission denied') || err.message.includes('NotAllowedError')) {
          errorMessage = "Permissão da câmera negada. Verifique as configurações do navegador.";
        } else if (err.message.includes('Nenhuma câmera')) {
          errorMessage = err.message;
        } else if (err.message.includes('NotFoundError')) {
          errorMessage = "Nenhuma câmera encontrada no dispositivo.";
        } else if (err.message.includes('NotReadableError')) {
          errorMessage = "Câmera está sendo usada por outro aplicativo.";
        }
      }

      toast.error("Erro de Câmera", { description: errorMessage });
      closeCamera();
    } finally {
      setIsInitializing(false);
      initializationRef.current = false;
    }
  }, [getAvailableCameras, selectBestCamera, initializeVideoStream, closeCamera, capturedImage]);

  useEffect(() => {
    if (isOpen && !capturedImage && !initializationRef.current) {
      console.log("📊 Dialog aberto, iniciando câmera...");
      const timeoutId = setTimeout(() => {
        startCamera();
      }, 300);
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isOpen, capturedImage, startCamera]);

  const captureImage = () => {
    if (!isCameraReady || !videoRef.current || !canvasRef.current) {
      console.warn("⚠️ Tentativa de captura com câmera não pronta");
      toast.warning("Câmera não pronta", { 
        description: "Aguarde a câmera carregar completamente antes de capturar." 
      });
      return;
    }

    console.log("📸 Capturando imagem...");
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn("⚠️ Dimensões de vídeo inválidas");
      toast.warning("Erro na captura", { 
        description: "O vídeo não está pronto. Tente novamente." 
      });
      return;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    
    if (context) {
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(dataUrl);
      console.log("✅ Imagem capturada com sucesso");

      // Para a stream após capturar
      if (video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
      setIsCameraReady(false);
    }
  };

  const resetCapture = () => {
    console.log("🔄 Resetando captura...");
    setCapturedImage(null);
    setIsCameraReady(false);
    initializationRef.current = false;
  };

  const handleConfirm = async () => {
    if (!capturedImage) return;

    setIsSubmitting(true);
    try {
      console.log("📤 Enviando imagem capturada...");
      
      // Converter dataURL para blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      
      // Criar arquivo com nome único
      const timestamp = Date.now();
      const file = new File([blob], `produto-${timestamp}.jpg`, { 
        type: 'image/jpeg' 
      });
      
      console.log("📁 Arquivo criado:", {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      await onImageCapture(file);
      console.log("✅ Upload da imagem concluído");
      closeCamera();
    } catch (error) {
      console.error("❌ Erro no upload da imagem:", error);
      toast.error("Falha no Upload", {
        description: "Não foi possível enviar a imagem.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeCamera()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Fotografar Produto</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-square bg-muted rounded-md flex items-center justify-center">
          {capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Produto capturado" 
              className="rounded-md max-h-full max-w-full object-contain" 
            />
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover rounded-md"
              />
              {(isInitializing || !isCameraReady) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white rounded-md">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="mt-2 text-sm">
                    {isInitializing ? "Iniciando câmera..." : "Aguardando câmera..."}
                  </p>
                </div>
              )}
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <CameraControls
          capturedImage={capturedImage}
          isCameraReady={isCameraReady}
          isInitializing={isInitializing}
          isSubmitting={isSubmitting}
          onCapture={captureImage}
          onReset={resetCapture}
          onConfirm={handleConfirm}
        />
      </DialogContent>
    </Dialog>
  );
};

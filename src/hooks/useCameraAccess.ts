
import { useRef, useCallback } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

interface CameraDevice {
  deviceId: string;
  label: string;
}

export const useCameraAccess = () => {
  const attemptRef = useRef(0);

  const getAvailableCameras = useCallback(async (): Promise<CameraDevice[]> => {
    try {
      console.log("🎥 Solicitando permissões de câmera...");
      
      // Solicita permissões de forma mais robusta
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        } 
      });
      
      // Para o stream temporário após obter permissões
      stream.getTracks().forEach(track => track.stop());
      console.log("✅ Permissões de câmera concedidas");
      
      // Aguarda um pouco para o dispositivo se estabilizar
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log("📱 Listando dispositivos de vídeo...");
      // Use instance method instead of static method
      const codeReader = new BrowserMultiFormatReader();
      const devices = await codeReader.listVideoInputDevices();
      console.log("📱 Câmeras encontradas:", devices.map(d => ({ id: d.deviceId, label: d.label })));
      
      if (!devices || devices.length === 0) {
        throw new Error('Nenhuma câmera encontrada no dispositivo.');
      }
      
      return devices.map(device => ({
        deviceId: device.deviceId,
        label: device.label || `Câmera ${device.deviceId.substring(0, 8)}`
      }));
    } catch (error) {
      console.error("❌ Erro ao acessar câmeras:", error);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error("Permissão da câmera negada. Habilite o acesso à câmera nas configurações do navegador.");
        } else if (error.name === 'NotFoundError') {
          throw new Error("Nenhuma câmera encontrada. Verifique se o dispositivo possui câmera.");
        } else if (error.name === 'NotReadableError') {
          throw new Error("Câmera em uso por outro aplicativo. Feche outros apps que usam a câmera.");
        }
      }
      
      throw error;
    }
  }, []);

  const selectBestCamera = useCallback((cameras: CameraDevice[]): string => {
    console.log("🔍 Selecionando melhor câmera...");
    
    // Prioriza câmeras traseiras (especialmente importante no mobile)
    const rearCameras = cameras.filter(camera => {
      const label = camera.label.toLowerCase();
      return label.includes('back') ||
             label.includes('rear') ||
             label.includes('environment') ||
             label.includes('traseira') ||
             label.includes('trás') ||
             label.includes('principal') ||
             label.includes('camera2 0') ||
             label.includes('facing back');
    });

    attemptRef.current += 1;
    
    let selectedDeviceId: string;
    if (attemptRef.current > 1 && cameras.length > 1) {
      const alternateIndex = (attemptRef.current - 1) % cameras.length;
      selectedDeviceId = cameras[alternateIndex].deviceId;
      console.log(`🔄 Tentativa ${attemptRef.current}: Usando câmera alternativa:`, cameras[alternateIndex].label);
    } else if (rearCameras.length > 0) {
      selectedDeviceId = rearCameras[0].deviceId;
      console.log("📷 Selecionando câmera traseira:", rearCameras[0].label);
    } else {
      selectedDeviceId = cameras[0].deviceId;
      console.log("📷 Selecionando primeira câmera disponível:", cameras[0].label);
    }
    
    return selectedDeviceId;
  }, []);

  const initializeVideoStream = useCallback(async (deviceId: string, videoElement: HTMLVideoElement): Promise<void> => {
    try {
      console.log(`🎬 Inicializando stream de vídeo para deviceId: ${deviceId}`);
      
      // Para stream existente se houver
      if (videoElement.srcObject) {
        console.log("🛑 Parando stream existente...");
        const existingStream = videoElement.srcObject as MediaStream;
        existingStream.getTracks().forEach(track => {
          track.stop();
          console.log("🛑 Track parada:", track.kind);
        });
        videoElement.srcObject = null;
      }

      // Configurações otimizadas para múltiplas orientações
      const constraints = {
        video: {
          deviceId: { exact: deviceId },
          facingMode: "environment",
          // Permite resolução adaptável para diferentes orientações
          width: { ideal: 1920, min: 480, max: 4096 },
          height: { ideal: 1080, min: 320, max: 2160 },
          frameRate: { ideal: 30, min: 10, max: 60 }
        },
        audio: false
      };
      
      console.log("📋 Solicitando getUserMedia com constraints:", constraints);
      
      // Retry logic para permissões
      let stream: MediaStream;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          break;
        } catch (error) {
          retryCount++;
          console.warn(`⚠️ Tentativa ${retryCount} falhou:`, error);
          
          if (retryCount === maxRetries) {
            throw error;
          }
          
          // Aguarda antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
        }
      }
      
      console.log("✅ Stream obtida com sucesso");
      console.log("📊 Detalhes da stream:", {
        tracks: stream!.getTracks().length,
        videoTracks: stream!.getVideoTracks().length,
        active: stream!.active
      });
      
      if (stream!.getVideoTracks().length === 0) {
        throw new Error("Nenhuma track de vídeo encontrada na stream");
      }
      
      // Configura as tracks para melhor performance
      const videoTrack = stream!.getVideoTracks()[0];
      console.log("📋 Video track settings:", videoTrack.getSettings());
      
      // Anexa stream ao elemento de vídeo
      videoElement.srcObject = stream!;
      console.log("📺 Stream anexada ao elemento de vídeo");
      
      // Aguarda o vídeo estar pronto com timeout mais generoso
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error("Timeout ao carregar vídeo - verifique permissões"));
        }, 20000); // Aumenta timeout para 20 segundos
        
        const onLoadedData = () => {
          clearTimeout(timeoutId);
          console.log("✅ Vídeo carregado e pronto");
          console.log("📐 Dimensões do vídeo:", {
            videoWidth: videoElement.videoWidth,
            videoHeight: videoElement.videoHeight
          });
          videoElement.removeEventListener('loadeddata', onLoadedData);
          videoElement.removeEventListener('error', onError);
          resolve();
        };
        
        const onError = (error: Event) => {
          clearTimeout(timeoutId);
          console.error("❌ Erro no elemento de vídeo:", error);
          videoElement.removeEventListener('loadeddata', onLoadedData);
          videoElement.removeEventListener('error', onError);
          reject(new Error("Erro ao carregar vídeo - problema de compatibilidade"));
        };
        
        videoElement.addEventListener('loadeddata', onLoadedData);
        videoElement.addEventListener('error', onError);
        
        // Configura propriedades do vídeo para melhor suporte mobile
        videoElement.setAttribute('playsinline', 'true');
        videoElement.setAttribute('webkit-playsinline', 'true');
        videoElement.setAttribute('x5-playsinline', 'true'); // Para browsers chineses
        videoElement.muted = true;
        videoElement.autoplay = true;
        
        // Força play de forma mais robusta
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("✅ Vídeo iniciado automaticamente");
            })
            .catch(e => {
              console.warn("⚠️ Não foi possível reproduzir automaticamente:", e);
              // Tenta forçar o play novamente após um delay
              setTimeout(() => {
                videoElement.play().catch(console.warn);
              }, 1000);
            });
        }
      });
      
    } catch (error) {
      console.error("❌ Erro ao inicializar stream de vídeo:", error);
      
      // Tratamento específico para erros comuns
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error("Permissão da câmera negada. Habilite o acesso à câmera nas configurações do navegador.");
        } else if (error.name === 'NotFoundError') {
          throw new Error("Nenhuma câmera encontrada. Verifique se o dispositivo possui câmera.");
        } else if (error.name === 'NotReadableError') {
          throw new Error("Câmera em uso por outro aplicativo. Feche outros apps que usam a câmera.");
        } else if (error.name === 'OverconstrainedError') {
          throw new Error("Configurações de câmera não suportadas pelo dispositivo.");
        } else if (error.name === 'AbortError') {
          throw new Error("Operação cancelada. Tente novamente.");
        }
      }
      
      throw error;
    }
  }, []);

  return {
    getAvailableCameras,
    selectBestCamera,
    initializeVideoStream,
    attemptRef
  };
};

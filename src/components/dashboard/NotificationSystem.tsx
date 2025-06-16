
import { useRef, useEffect, useState } from "react";
import { Transfer } from "@/contexts/TransferContext";
import { toast } from "@/hooks/use-toast";
import { BranchId } from "@/contexts/AuthContext";

interface NotificationSystemProps {
  incomingTransfers: Transfer[];
  currentBranch: BranchId | null;
  onNewRequestsChange?: (hasNew: boolean) => void;
}

export const NotificationSystem = ({ 
  incomingTransfers, 
  currentBranch,
  onNewRequestsChange
}: NotificationSystemProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasNewRequests, setHasNewRequests] = useState(false);
  const [prevRequestsCount, setPrevRequestsCount] = useState(0);

  // Check for new incoming requests and trigger notification
  useEffect(() => {
    const incomingSolicitations = incomingTransfers.filter(t => t.status === "Solicitado").length;
    
    // Only trigger notification if we have previous data to compare to and there are new solicitations
    if (prevRequestsCount > 0 && incomingSolicitations > prevRequestsCount) {
      setHasNewRequests(true);
      if (onNewRequestsChange) {
        onNewRequestsChange(true);
      }
      
      // Make sure to properly handle the audio playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset audio to start
        audioRef.current.volume = 1.0;
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error);
        });
      }
      
      // Show a toast notification
      toast({
        title: "Nova solicitação recebida",
        description: "Você tem uma nova transferência para processar",
        variant: "default",
      });
    }
    
    setPrevRequestsCount(incomingSolicitations);

    // Reset hasNewRequests after a minute
    if (hasNewRequests) {
      const timeout = setTimeout(() => {
        setHasNewRequests(false);
        if (onNewRequestsChange) {
          onNewRequestsChange(false);
        }
      }, 60000); // 1 minute
      return () => clearTimeout(timeout);
    }
  }, [incomingTransfers, prevRequestsCount, hasNewRequests, onNewRequestsChange]);

  return <audio ref={audioRef} src="/notification.wav" preload="auto" />;
};

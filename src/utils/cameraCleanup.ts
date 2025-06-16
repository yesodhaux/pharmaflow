
export const cleanupVideoElement = (videoElement: HTMLVideoElement | null) => {
  if (!videoElement) return;

  try {
    videoElement.pause();
    
    if (videoElement.srcObject) {
      const mediaStream = videoElement.srcObject as MediaStream;
      const tracks = mediaStream.getTracks();
      tracks.forEach(track => track.stop());
      videoElement.srcObject = null;
    }
  } catch (error) {
    console.error("Error cleaning up video element:", error);
  }
};

export const cleanupTimeouts = (...timeouts: (NodeJS.Timeout | null)[]) => {
  timeouts.forEach(timeout => {
    if (timeout) {
      clearTimeout(timeout);
    }
  });
};

export const cleanupIntervals = (...intervals: (NodeJS.Timeout | null)[]) => {
  intervals.forEach(interval => {
    if (interval) {
      clearInterval(interval);
    }
  });
};

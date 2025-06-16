
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { CameraDialog } from './CameraDialog';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void | Promise<void>;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openCamera = () => {
    console.log("🎬 Abrindo câmera...");
    setIsDialogOpen(true);
  };

  const closeCamera = () => {
    console.log("🔒 Fechando câmera...");
    setIsDialogOpen(false);
  };

  const handleImageCapture = async (file: File) => {
    await onImageUpload(file);
  };

  return (
    <>
      <Button variant="outline" onClick={openCamera}>
        <Camera className="mr-2 h-4 w-4" />
        Tirar Foto
      </Button>

      <CameraDialog
        isOpen={isDialogOpen}
        onClose={closeCamera}
        onImageCapture={handleImageCapture}
      />
    </>
  );
};

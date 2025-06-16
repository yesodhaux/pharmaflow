
import React, { useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CameraOff } from "lucide-react";
import { useTransfer } from "@/contexts/TransferContext";
import { ImageUploader } from "./ImageUploader";

interface ProductImageProps {
  productName: string;
  imageUrl?: string | null;
  transferId?: string;
  onImageUpload?: (file: File) => void;
}

export const ProductImage = ({ productName, imageUrl, transferId, onImageUpload }: ProductImageProps) => {
  const { updateProductImage } = useTransfer();
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    setImageLoadError(false);
  }, [imageUrl]);

  const handleImageUpload = async (file: File) => {
    if (transferId) {
      await updateProductImage(transferId, file);
    } else if (onImageUpload) {
      onImageUpload(file);
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto mb-4 text-center">
      <AspectRatio ratio={1} className="bg-muted rounded-lg flex items-center justify-center">
        {!imageUrl || imageLoadError ? (
          <div className="text-center text-muted-foreground">
            <CameraOff className="mx-auto h-12 w-12" />
            <p className="mt-2 text-sm">Sem imagem</p>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`Imagem do produto: ${productName}`}
            className="rounded-lg object-cover w-full h-full border border-gray-200"
            onLoad={() => setImageLoadError(false)}
            onError={() => {
              console.log("❌ ProductImage - Erro ao carregar imagem:", imageUrl);
              setImageLoadError(true);
            }}
          />
        )}
      </AspectRatio>

      <div className="mt-4">
        <ImageUploader onImageUpload={handleImageUpload} />
      </div>
    </div>
  );
};

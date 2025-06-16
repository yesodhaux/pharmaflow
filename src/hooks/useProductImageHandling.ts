
import { useState } from "react";

export const useProductImageHandling = () => {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);

  const handleProductImageUpload = (file: File) => {
    setProductImage(file);
    const previewUrl = URL.createObjectURL(file);
    setProductImagePreview(previewUrl);
  };

  return {
    productImage,
    setProductImage,
    productImagePreview,
    setProductImagePreview,
    handleProductImageUpload,
  };
};

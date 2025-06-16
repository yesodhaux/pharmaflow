
import { Button } from "@/components/ui/button";
import { ScanBarcodeIcon } from "lucide-react";

interface ScanButtonProps {
  onClick: () => void;
}

export const ScanButton = ({ onClick }: ScanButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onClick}
      className="h-10 w-10"
      aria-label="Escanear código de barras"
    >
      <ScanBarcodeIcon className="h-4 w-4" />
    </Button>
  );
};

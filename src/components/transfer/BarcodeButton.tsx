
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import { BarcodeGenerator } from './BarcodeGenerator';

interface BarcodeButtonProps {
  danfeKey: string;
  size?: 'sm' | 'default';
}

export const BarcodeButton: React.FC<BarcodeButtonProps> = ({ 
  danfeKey, 
  size = 'default' 
}) => {
  const [showGenerator, setShowGenerator] = useState(false);

  if (!danfeKey) return null;

  return (
    <>
      <Button
        variant="outline"
        size={size}
        onClick={() => setShowGenerator(true)}
        className="gap-2"
      >
        <QrCode className="h-4 w-4" />
        Gerar Código
      </Button>
      
      <BarcodeGenerator
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
        danfeKey={danfeKey}
      />
    </>
  );
};


import React, { useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface BarcodeGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  danfeKey: string;
}

export const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({
  isOpen,
  onClose,
  danfeKey
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && danfeKey && canvasRef.current) {
      generateBarcode();
    }
  }, [isOpen, danfeKey]);

  // Tabela de codificação Code 128 simplificada
  const getCode128Pattern = (value: number): string => {
    const patterns = [
      '11011001100', '11001101100', '11001100110', '10010011000', '10010001100',
      '10001001100', '10011001000', '10011000100', '10001100100', '11001001000',
      '11001000100', '11000100100', '10110011100', '10011011100', '10011001110',
      '10111001000', '10011101000', '10011100010', '11001110010', '11001011100'
    ];
    return patterns[value % patterns.length] || patterns[0];
  };

  const generateBarcode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurações
    const barcodeWidth = 600;
    const barcodeHeight = 150;
    const barHeight = 100;
    const startY = 20;
    const barWidth = 2;
    
    canvas.width = barcodeWidth;
    canvas.height = barcodeHeight;

    // Fundo branco
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gera código de barras baseado na chave DANFE
    ctx.fillStyle = 'black';
    
    let x = 20;
    
    // Padrão de início Code 128 (Start A)
    const startPattern = '11010000100';
    for (let i = 0; i < startPattern.length; i++) {
      if (startPattern[i] === '1') {
        ctx.fillRect(x, startY, barWidth, barHeight);
      }
      x += barWidth;
    }
    
    // Converte cada caractere da chave em padrão de barras
    for (let i = 0; i < danfeKey.length && x < barcodeWidth - 60; i++) {
      const charCode = danfeKey.charCodeAt(i);
      const pattern = getCode128Pattern(charCode);
      
      for (let j = 0; j < pattern.length; j++) {
        if (pattern[j] === '1') {
          ctx.fillRect(x, startY, barWidth, barHeight);
        }
        x += barWidth;
      }
      x += barWidth; // Espaço entre caracteres
    }
    
    // Padrão de fim
    const endPattern = '1100011101011';
    for (let i = 0; i < endPattern.length; i++) {
      if (endPattern[i] === '1') {
        ctx.fillRect(x, startY, barWidth, barHeight);
      }
      x += barWidth;
    }

    // Texto da chave embaixo
    ctx.fillStyle = 'black';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    
    // Quebra o texto em linhas se necessário
    const maxCharsPerLine = 30;
    const lines = [];
    for (let i = 0; i < danfeKey.length; i += maxCharsPerLine) {
      lines.push(danfeKey.substring(i, i + maxCharsPerLine));
    }
    
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, canvas.height - 25 + (index * 15));
    });
  };

  const downloadBarcode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `barcode-danfe-${danfeKey.substring(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Código de Barras da DANFE</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-md border shadow-sm">
            <canvas 
              ref={canvasRef}
              className="w-full h-auto border border-gray-200 rounded"
              style={{ maxWidth: '100%' }}
            />
          </div>
          
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p className="font-medium">Chave de Acesso DANFE:</p>
            <p className="font-mono text-xs break-all bg-muted p-2 rounded">
              {danfeKey}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Fechar
            </Button>
            <Button onClick={downloadBarcode} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Baixar PNG
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

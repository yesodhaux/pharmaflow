
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MedicineResult } from "@/hooks/useMedicineSearch";
import { Loader2 } from "lucide-react";

interface ProductSearchResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: MedicineResult[];
  onSelectProduct: (product: MedicineResult) => void;
  loading: boolean;
}

export const ProductSearchResultsDialog = ({
  open,
  onOpenChange,
  results,
  onSelectProduct,
  loading,
}: ProductSearchResultsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Resultados da Busca</DialogTitle>
          <DialogDescription>
            Selecione um produto da lista abaixo para preencher o formulário.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="ml-2">Buscando produtos...</p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cód. Barras</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.length > 0 ? (
                    results.map((product) => (
                      <TableRow key={product.codinterno}>
                        <TableCell className="font-medium">{product.nome}</TableCell>
                        <TableCell>{product.codbarras}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSelectProduct(product)}
                          >
                            Selecionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        Nenhum resultado encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

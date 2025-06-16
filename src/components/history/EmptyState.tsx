
import { HistoryIcon } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center p-12 border rounded-lg bg-muted/20">
      <HistoryIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
      <h3 className="mt-4 text-lg font-medium">Nenhuma transferência encontrada</h3>
      <p className="text-muted-foreground mt-2">
        Tente ajustar os filtros ou criar uma nova transferência.
      </p>
    </div>
  );
}

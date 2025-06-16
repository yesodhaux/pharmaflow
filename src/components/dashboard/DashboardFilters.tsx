
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransferStatus } from "@/contexts/TransferContext";
import { useNavigate } from "react-router-dom";

interface DashboardFiltersProps {
  statusFilter: TransferStatus | "all";
  searchQuery: string;
  onStatusFilterChange: (value: TransferStatus | "all") => void;
  onSearchQueryChange: (value: string) => void;
}

export const DashboardFilters = ({
  statusFilter,
  searchQuery,
  onStatusFilterChange,
  onSearchQueryChange,
}: DashboardFiltersProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid gap-4 md:grid-cols-3 items-end">
      <div className="space-y-2">
        <Label htmlFor="status">Filtrar por Status</Label>
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as TransferStatus | "all")}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Todos os Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="Solicitado">Solicitado</SelectItem>
            <SelectItem value="Em preparo">Em preparo</SelectItem>
            <SelectItem value="Enviado">Enviado</SelectItem>
            <SelectItem value="Concluído">Concluído</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="search">Buscar Produto</Label>
        <Input
          id="search"
          placeholder="Digite o nome do produto ou ID"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
      </div>
      <div>
        <Button 
          className="w-full"
          onClick={() => navigate("/new-transfer")}
        >
          Nova Transferência
        </Button>
      </div>
    </div>
  );
};

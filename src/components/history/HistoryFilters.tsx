
import { BranchId, ALL_BRANCHES } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { format } from "date-fns";

interface HistoryFiltersProps {
  branchFilter: BranchId | "all";
  setBranchFilter: (value: BranchId | "all") => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  currentBranch: BranchId | null;
  uniqueDates: string[];
}

export function HistoryFilters({
  branchFilter,
  setBranchFilter,
  dateFilter,
  setDateFilter,
  searchQuery,
  setSearchQuery,
  currentBranch,
  uniqueDates
}: HistoryFiltersProps) {
  // Get branch options (excluding current branch)
  const branchOptions = ALL_BRANCHES.filter(branch => branch !== currentBranch);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Filtros</CardTitle>
        <CardDescription>Refine a busca para encontrar transferências específicas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="branchFilter">Filial</Label>
            <Select
              value={branchFilter}
              onValueChange={(value) => setBranchFilter(value as BranchId | "all")}
            >
              <SelectTrigger id="branchFilter">
                <SelectValue placeholder="Todas as Filiais" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Filiais</SelectItem>
                {branchOptions.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateFilter">Data</Label>
            <Select
              value={dateFilter}
              onValueChange={setDateFilter}
            >
              <SelectTrigger id="dateFilter">
                <SelectValue placeholder="Todas as Datas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Datas</SelectItem>
                {uniqueDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {formatDate(date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="search">Buscar</Label>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Produto ou ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

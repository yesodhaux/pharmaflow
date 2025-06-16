
import React from "react";
import { useAuth, ALL_BRANCHES, BranchId } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BranchSelectionProps {
  toBranch: BranchId | "";
  setToBranch: (value: BranchId | "") => void;
}

export const BranchSelection = ({ toBranch, setToBranch }: BranchSelectionProps) => {
  const { currentBranch } = useAuth();
  const destinationOptions = ALL_BRANCHES.filter((branch) => branch !== currentBranch);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="fromBranch">Filial Solicitante</Label>
        <Input id="fromBranch" value={currentBranch || ""} disabled />
      </div>

      <div className="space-y-2">
        <Label htmlFor="toBranch">Filial Fornecedora</Label>
        <Select
          value={toBranch}
          onValueChange={(value) => setToBranch(value as BranchId)}
        >
          <SelectTrigger id="toBranch">
            <SelectValue placeholder="Selecione a filial" />
          </SelectTrigger>
          <SelectContent>
            {destinationOptions.map((branch) => (
              <SelectItem key={branch} value={branch}>
                {branch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

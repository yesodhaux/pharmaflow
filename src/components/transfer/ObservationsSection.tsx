
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ObservationsSectionProps {
  observations: string;
  setObservations: (value: string) => void;
}

export const ObservationsSection = ({ observations, setObservations }: ObservationsSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="observations">Observações</Label>
      <Textarea
        id="observations"
        placeholder="Informações adicionais sobre o produto ou transferência"
        value={observations}
        onChange={(e) => setObservations(e.target.value)}
        rows={4}
      />
    </div>
  );
};

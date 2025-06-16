
import React from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const FormHeader = () => {
  return (
    <CardHeader>
      <CardTitle>Dados da Solicitação</CardTitle>
      <CardDescription>
        Preencha os detalhes da transferência que deseja solicitar
      </CardDescription>
    </CardHeader>
  );
};

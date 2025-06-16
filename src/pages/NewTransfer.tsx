
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { TransferForm } from "@/components/transfer/TransferForm";

const NewTransfer = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nova Transferência</h1>
          <p className="text-muted-foreground">
            Solicite transferência de medicamentos para sua filial
          </p>
        </div>

        <TransferForm />
      </div>
    </DashboardLayout>
  );
};

export default NewTransfer;

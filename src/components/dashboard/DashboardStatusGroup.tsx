
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BellRing, Inbox, PackageCheckIcon, TimerIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface DashboardStatusGroupProps {
  direction: "incoming" | "outgoing";
  counts: {
    all: number;
    solicitado: number;
    emPreparo: number;
    enviado: number;
    concluido: number;
  };
  hasNewRequests?: boolean;
  onSolicitadasClick?: () => void;
}

export const DashboardStatusGroup: React.FC<DashboardStatusGroupProps> = ({
  direction,
  counts,
  hasNewRequests = false,
  onSolicitadasClick,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-4 mb-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
          <Inbox className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{counts.all}</div>
          <p className="text-xs text-muted-foreground">Todas as transferências</p>
        </CardContent>
      </Card>
      <Card
        onClick={direction === "incoming" ? onSolicitadasClick : undefined}
        className={cn(
          "transition-shadow",
          direction === "incoming" && onSolicitadasClick && "cursor-pointer hover:shadow-lg",
          direction === "incoming" && hasNewRequests
            ? "animate-pulse bg-red-50 border border-red-200 shadow-md shadow-red-200"
            : ""
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            {direction === "incoming" && hasNewRequests && (
              <BellRing className="inline-block mr-1 w-4 h-4 text-red-600 animate-bounce" />
            )}
            Solicitadas
          </CardTitle>
          <Inbox className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={"text-2xl font-bold " + (direction === "incoming" && hasNewRequests ? "text-red-600" : "")}>
            {counts.solicitado}
          </div>
          <p className="text-xs text-muted-foreground">
            Aguardando processamento
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          <TimerIcon className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{counts.emPreparo + counts.enviado}</div>
          <p className="text-xs text-muted-foreground">
            Em preparo ou enviadas
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
          <PackageCheckIcon className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{counts.concluido}</div>
          <p className="text-xs text-muted-foreground">
            Transferências finalizadas
          </p>
        </CardContent>
      </Card>
    </div>
  );
};


import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTransfer } from "@/contexts/TransferContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTransferStatus } from "@/hooks/useTransferStatus";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { TransferHeader } from "@/components/transfer/TransferHeader";
import { TransferDetails } from "@/components/transfer/TransferDetails";
import { StatusHistory } from "@/components/transfer/StatusHistory";
import { DanfeInput } from "@/components/transfer/DanfeInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { AlertCircle, PackageCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { BarcodeButton } from "@/components/transfer/BarcodeButton";

const TransferDetail = () => {
  const { id } = useParams();
  const { getTransferById, updateTransferStatus, updateTransferDanfe } = useTransfer();
  const { currentBranch } = useAuth();
  const navigate = useNavigate();
  
  const [danfeKey, setDanfeKey] = useState("");
  const [danfeFile, setDanfeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const transfer = getTransferById(id || "");
  
  if (!transfer) {
    return (
      <DashboardLayout>
        <Alert variant="destructive" className="max-w-md mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Transferência não encontrada. O ID informado não existe ou você não tem acesso a esta transferência.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={() => navigate("/dashboard")}>
            Voltar para o Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  const isInvolved = currentBranch === transfer.fromBranch || currentBranch === transfer.toBranch;
  const isProvider = currentBranch === transfer.toBranch;
  const isRequester = currentBranch === transfer.fromBranch;
  
  if (!isInvolved) {
    return (
      <DashboardLayout>
        <Alert variant="destructive" className="max-w-md mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para visualizar esta transferência. Apenas as filiais envolvidas podem acessá-la.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={() => navigate("/dashboard")}>
            Voltar para o Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  const { getNextStatus } = useTransferStatus(transfer.status, isProvider, isRequester);
  const nextStatus = getNextStatus();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDanfeFile(e.target.files[0]);
    } else {
      setDanfeFile(null);
    }
  };
  
  const handleUpdateStatus = async () => {
    if (!nextStatus || !currentBranch) return;
    
    setIsSubmitting(true);
    
    try {
      if (nextStatus === "Enviado") {
        if (!danfeKey.trim()) {
          toast.error("Informação obrigatória", {
            description: "Informe a chave de acesso da DANFE antes de enviar o produto."
          });
          setIsSubmitting(false);
          return;
        }
        
        await updateTransferDanfe(transfer.id, danfeKey, danfeFile);
      }
      
      await updateTransferStatus(transfer.id, nextStatus, currentBranch);
      toast.success(`Status atualizado para ${nextStatus}`, {
        description: "A transferência foi atualizada com sucesso."
      });
    } catch (error) {
      console.error('Error updating transfer:', error);
      toast.error("Erro ao atualizar", {
        description: "Ocorreu um erro ao atualizar a transferência. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <TransferHeader transfer={transfer} />

        <Card>
          <CardHeader>
            <CardTitle>Informações da Transferência</CardTitle>
            <CardDescription>
              Detalhes completos da solicitação de transferência
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <TransferDetails transfer={transfer} />
            
            {/* Mostra chave DANFE e botão de código de barras se disponível */}
            {transfer.danfeKey && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Chave de Acesso da DANFE</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-2 bg-muted rounded-md text-sm font-mono">
                      {transfer.danfeKey}
                    </div>
                    <BarcodeButton danfeKey={transfer.danfeKey} size="sm" />
                  </div>
                </div>
              </>
            )}
            
            <Separator />
            
            <StatusHistory statusHistory={transfer.statusHistory} />
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            {isProvider && transfer.status === "Em preparo" && (
              <DanfeInput
                danfeKey={danfeKey}
                setDanfeKey={setDanfeKey}
                handleFileChange={handleFileChange}
              />
            )}
            
            <div className="w-full flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate("/dashboard")}
              >
                Voltar
              </Button>
              
              {nextStatus && (
                <Button 
                  onClick={handleUpdateStatus} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Atualizando..." : `Marcar como ${nextStatus}`}
                  <PackageCheck className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransferDetail;

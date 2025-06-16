import { useState } from "react";
import { Transfer, TransferStatus } from "@/types/transfer";
import { BranchId } from "@/contexts/AuthContext";
import { toast } from "sonner";
import * as transferApi from "@/api/transferApi";
import { formatTransferData } from "@/utils/transferUtils";

export function useTransferOperations() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  const loadTransfers = async () => {
    try {
      console.log('📋 Loading transfers...');
      const transfersData = await transferApi.fetchTransfers();

      if (transfersData) {
        const transfersWithHistory: Transfer[] = [];
        
        for (const transfer of transfersData) {
          const historyData = await transferApi.fetchTransferHistory(transfer.id);
          const formattedTransfer = formatTransferData(transfer, historyData || []);
          
          if (transfer.product_image_url) {
            formattedTransfer.product_image_url = transfer.product_image_url;
          }

          transfersWithHistory.push(formattedTransfer);
        }
        
        console.log('✅ Transfers loaded successfully:', transfersWithHistory.length);
        setTransfers(transfersWithHistory);
      }
    } catch (error) {
      console.error('❌ Error loading transfers:', error);
      toast.error("Erro ao carregar transferências", {
        description: "Não foi possível carregar as transferências. Tente novamente."
      });
    }
  };

  const createTransfer = async (
    transferData: Omit<Transfer, "id" | "requestDate" | "status" | "statusHistory"> & { productImage?: File | null }
  ): Promise<boolean> => {
    try {
      console.log('🚀 Creating transfer with data:', transferData);
      const { productImage, ...restTransferData } = transferData;
      
      // Create the transfer data object with proper typing
      const createData = {
        fromBranch: restTransferData.fromBranch as BranchId,
        toBranch: restTransferData.toBranch as BranchId,
        product: restTransferData.product,
        quantity: restTransferData.quantity,
        observations: restTransferData.observations,
        productBarcode: restTransferData.productBarcode,
        productInternalCode: restTransferData.productInternalCode,
      };
      
      const transfer = await transferApi.createNewTransfer(createData);
      console.log('✅ Transfer created with ID:', transfer.id);

      if (transfer) {
        await transferApi.createStatusHistory(transfer.id, 'Solicitado', transferData.fromBranch as BranchId);
        console.log('✅ Status history created');

        if (productImage && productImage.size > 0) {
          console.log('📷 Starting image upload for new transfer...');
          console.log('📁 Image details:', {
            name: productImage.name,
            size: productImage.size,
            type: productImage.type
          });
          
          try {
            console.log('🔄 Uploading image to storage...');
            const publicUrl = await transferApi.uploadProductImage(transfer.id, productImage);
            console.log('✅ Image uploaded successfully, URL received:', publicUrl);
            
            if (publicUrl) {
              console.log('💾 Updating database with image URL...');
              await transferApi.updateTransferProductImageUrl(transfer.id, publicUrl);
              console.log('✅ Database updated successfully');
              
              toast.success("Transferência criada com imagem", {
                description: "Solicitação e imagem enviadas com sucesso"
              });
            } else {
              throw new Error('URL da imagem não foi retornada pelo upload');
            }
          } catch (imageError) {
            console.error('❌ Error uploading product image:', imageError);
            
            toast.warning("Transferência criada, mas falha no upload da imagem", {
              description: "A transferência foi criada mas a imagem não foi salva. Tente fazer o upload novamente."
            });
          }
        } else {
          console.log('ℹ️ No product image to upload');
          toast.success("Transferência criada", {
            description: `Solicitação enviada para ${transferData.toBranch}`
          });
        }

        await loadTransfers();
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error creating transfer:', error);
      toast.error("Erro ao criar transferência", {
        description: "Não foi possível criar a transferência. Tente novamente."
      });
      return false;
    }
  };

  const updateTransferStatus = async (id: string, newStatus: TransferStatus, updatedBy: BranchId) => {
    try {
      await transferApi.updateTransferStatus(id, newStatus);
      await transferApi.createStatusHistory(id, newStatus, updatedBy);
      await loadTransfers();
      
      toast.success("Status atualizado", {
        description: `Status alterado para: ${newStatus}`
      });
    } catch (error) {
      console.error('Error updating transfer status:', error);
      toast.error("Erro ao atualizar status", {
        description: "Não foi possível atualizar o status. Tente novamente."
      });
    }
  };

  const updateTransferDanfe = async (id: string, danfeKey: string, danfeFile?: File | null) => {
    try {
      let publicUrl;
      if (danfeFile) {
        publicUrl = await transferApi.uploadDanfeFile(id, danfeFile);
        await transferApi.updateTransferDanfeInfo(id, danfeKey, publicUrl);
      } else {
        await transferApi.updateTransferDanfeInfo(id, danfeKey);
      }

      await loadTransfers();
      toast.success("DANFE atualizada", {
        description: "Informações da DANFE atualizadas com sucesso"
      });
    } catch (error) {
      console.error('Error updating DANFE:', error);
      toast.error("Erro ao atualizar DANFE", {
        description: "Não foi possível atualizar as informações da DANFE. Tente novamente."
      });
    }
  };

  const updateProductImage = async (id: string, imageFile: File) => {
    try {
      console.log('📷 Starting product image update for transfer:', id);
      console.log('📁 Image file details:', {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type
      });

      console.log('🔄 Uploading image to Supabase storage...');
      const publicUrl = await transferApi.uploadProductImage(id, imageFile);
      console.log('✅ Image uploaded, received URL:', publicUrl);
      
      if (publicUrl) {
        console.log('💾 Updating database with new image URL...');
        await transferApi.updateTransferProductImageUrl(id, publicUrl);
        console.log('✅ Database updated with image URL');
        
        console.log('🔄 Reloading transfers to reflect changes...');
        await loadTransfers();
        console.log('✅ Transfers reloaded successfully');
        
        toast.success("Imagem do produto atualizada", {
          description: "A nova imagem foi salva com sucesso."
        });
      } else {
        throw new Error('Upload não retornou uma URL válida');
      }
    } catch (error) {
      console.error('❌ Error updating product image:', error);
      toast.error("Erro ao atualizar imagem", {
        description: "Não foi possível salvar a imagem do produto. Tente novamente."
      });
    }
  };

  const getTransfersForBranch = (branchId: BranchId) => {
    return transfers.filter(
      (transfer) => transfer.fromBranch === branchId || transfer.toBranch === branchId
    );
  };

  const getTransferById = (id: string) => {
    return transfers.find((transfer) => transfer.id === id);
  };

  return {
    transfers,
    loadTransfers,
    createTransfer,
    updateTransferStatus,
    updateTransferDanfe,
    updateProductImage,
    getTransfersForBranch,
    getTransferById,
  };
}

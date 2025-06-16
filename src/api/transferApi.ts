import { supabase } from "@/lib/supabase";
import { Transfer, TransferStatus } from "@/types/transfer";
import { BranchId } from "@/contexts/AuthContext";

export const fetchTransfers = async () => {
  const { data: transfersData, error: transfersError } = await supabase
    .from('transfers')
    .select('*')
    .order('request_date', { ascending: false });

  if (transfersError) throw transfersError;
  return transfersData;
};

export const fetchTransferHistory = async (transferId: string) => {
  const { data: historyData, error: historyError } = await supabase
    .from('status_history')
    .select('*')
    .eq('transfer_id', transferId)
    .order('created_at', { ascending: true });

  if (historyError) throw historyError;
  return historyData;
};

export const createNewTransfer = async (transferData: {
  fromBranch: BranchId;
  toBranch: BranchId;
  product: string;
  quantity: number;
  observations?: string;
}) => {
  const { data: transfer, error: transferError } = await supabase
    .from('transfers')
    .insert([{
      from_branch: transferData.fromBranch,
      to_branch: transferData.toBranch,
      product: transferData.product,
      quantity: transferData.quantity,
      observations: transferData.observations,
      status: 'Solicitado'
    }])
    .select()
    .single();

  if (transferError) {
    console.error('Error creating transfer:', transferError);
    throw transferError;
  }

  return transfer;
};

export const createStatusHistory = async (transferId: string, status: TransferStatus, updatedBy: BranchId) => {
  const { error: historyError } = await supabase
    .from('status_history')
    .insert([{
      transfer_id: transferId,
      status,
      updated_by: updatedBy
    }]);

  if (historyError) {
    console.error('Error creating status history:', historyError);
    throw historyError;
  }
};

export const updateTransferStatus = async (id: string, status: TransferStatus) => {
  const { error } = await supabase
    .from('transfers')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
};

export const uploadDanfeFile = async (id: string, file: File) => {
  // Generate a unique filename with transfer ID and original filename
  const filename = `${id}_${file.name}`;
  
  // Upload the file to the danfe-files bucket
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('danfe-files')
    .upload(`${id}/${filename}`, file, {
      upsert: true // Allow overwriting existing files
    });

  if (uploadError) {
    console.error('Error uploading DANFE file:', uploadError);
    throw uploadError;
  }

  // Get the public URL for the uploaded file
  const { data: { publicUrl } } = supabase
    .storage
    .from('danfe-files')
    .getPublicUrl(`${id}/${filename}`);

  return publicUrl;
};

export const getDanfeFileUrl = async (transferId: string, filename: string) => {
  const { data: { publicUrl } } = supabase
    .storage
    .from('danfe-files')
    .getPublicUrl(`${transferId}/${filename}`);

  return publicUrl;
};

export const updateTransferDanfeInfo = async (id: string, danfeKey: string, danfeUrl?: string) => {
  const updateData = danfeUrl 
    ? { danfe_key: danfeKey, danfe_url: danfeUrl }
    : { danfe_key: danfeKey };

  const { error } = await supabase
    .from('transfers')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
};

export const uploadProductImage = async (transferId: string, file: File) => {
  console.log('📷 Starting upload for transfer:', transferId);
  console.log('📁 File details:', { name: file.name, size: file.size, type: file.type });

  // Validação básica do arquivo
  if (!file || file.size === 0) {
    throw new Error('Arquivo de imagem inválido');
  }

  // Validação do tipo de arquivo
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.');
  }

  // Validação do tamanho (máximo 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('Arquivo muito grande. Máximo 5MB permitido.');
  }

  // Generate a unique filename to avoid conflicts
  const timestamp = Date.now();
  const cleanFileName = file.name.replace(/\s/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
  const filename = `${transferId}/${timestamp}_${cleanFileName}`;
  
  console.log('📂 Upload path:', filename);

  try {
    // Fazer upload do arquivo
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('product-images')
      .upload(filename, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    console.log('✅ Upload successful:', uploadData);

    // Obter URL pública
    const { data: { publicUrl } } = supabase
      .storage
      .from('product-images')
      .getPublicUrl(filename);

    console.log('🔗 Generated public URL:', publicUrl);

    // Verificação simples da URL
    if (!publicUrl || !publicUrl.includes('supabase')) {
      throw new Error('Falha ao gerar URL pública para a imagem');
    }

    return publicUrl;
  } catch (error) {
    console.error('❌ Error in uploadProductImage:', error);
    throw error;
  }
};

export const updateTransferProductImageUrl = async (id: string, imageUrl: string) => {
  console.log('💾 Updating database with image URL for transfer:', id);
  console.log('🔗 Image URL:', imageUrl);

  // Validação básica da URL
  if (!imageUrl || imageUrl.trim() === '') {
    throw new Error('URL da imagem não pode estar vazia');
  }

  if (!imageUrl.includes('supabase')) {
    throw new Error('URL da imagem inválida');
  }

  try {
    const { data, error } = await supabase
      .from('transfers')
      .update({ product_image_url: imageUrl })
      .eq('id', id)
      .select('id, product_image_url');

    if (error) {
      console.error('❌ Database update error:', error);
      throw new Error(`Erro ao atualizar banco de dados: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('Transferência não encontrada para atualização');
    }

    console.log('✅ Database updated successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error in updateTransferProductImageUrl:', error);
    throw error;
  }
};

export const findLatestProductImageUrl = async (productName: string): Promise<string | null> => {
  if (!productName) return null;

  console.log(`🖼️ Buscando imagem para o produto: ${productName}`);

  const { data, error } = await supabase
    .from('transfers')
    .select('product_image_url')
    .eq('product', productName)
    .not('product_image_url', 'is', null)
    .order('request_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar imagem do produto de transferências anteriores:', error);
    return null;
  }

  if (data && data.product_image_url) {
    console.log(`✅ Imagem encontrada: ${data.product_image_url}`);
    return data.product_image_url;
  }
  
  console.log('❌ Nenhuma imagem encontrada para este produto em transferências anteriores.');
  return null;
};

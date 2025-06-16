
-- Remove o índice antigo, que não considerava letras maiúsculas/minúsculas.
DROP INDEX IF EXISTS public.idx_medicines_nome_trgm;

-- Recria o índice na coluna 'nome' usando a função lower(), que converte tudo para minúsculas.
-- Isso garante que a busca por similaridade seja rápida e case-insensitive (não diferencia maiúsculas de minúsculas).
CREATE INDEX IF NOT EXISTS idx_medicines_nome_trgm ON public.medicines USING gin (lower(nome) gin_trgm_ops);

-- Atualiza a função de busca para que ela também seja case-insensitive.
-- Agora, tanto o nome do medicamento no banco quanto o termo buscado são convertidos para minúsculas antes da comparação.
-- Isso garante que "propanolol" encontre "PROPRANOLOL".
CREATE OR REPLACE FUNCTION search_medicines_by_name(search_term TEXT)
RETURNS TABLE(codbarras TEXT, codinterno TEXT, nome TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.codbarras,
    m.codinterno,
    m.nome
  FROM
    public.medicines AS m
  WHERE
    -- A busca agora é feita toda em minúsculas para garantir os resultados.
    lower(m.nome) % lower(search_term)
  ORDER BY
    -- A ordenação por similaridade também ignora o case.
    similarity(lower(m.nome), lower(search_term)) DESC,
    m.nome;
END;
$$ LANGUAGE plpgsql;

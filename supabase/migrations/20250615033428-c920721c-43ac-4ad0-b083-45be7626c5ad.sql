
-- Habilita a extensão pg_trgm para busca por similaridade (fuzzy search)
-- Usamos IF NOT EXISTS para não dar erro se ela já estiver ativa.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Cria um índice na coluna 'nome' da tabela 'medicines' para otimizar as buscas por similaridade.
-- Isso garante que a busca continue rápida, mesmo com mais medicamentos na base.
-- Usamos IF NOT EXISTS para evitar erros caso o índice já exista.
CREATE INDEX IF NOT EXISTS idx_medicines_nome_trgm ON public.medicines USING gin (nome gin_trgm_ops);

-- Cria ou substitui uma função no banco de dados para buscar medicamentos por nome com similaridade.
-- Esta função será chamada pela aplicação para realizar a busca "inteligente".
CREATE OR REPLACE FUNCTION search_medicines_by_name(search_term TEXT)
RETURNS TABLE(codbarras TEXT, codinterno TEXT, nome TEXT) AS $$
BEGIN
  -- A busca agora usa o operador '%' que aproveita o índice pg_trgm que criamos.
  -- Ele retorna produtos onde a similaridade com o termo buscado é maior que o padrão (0.3).
  -- Os resultados são ordenados pela maior similaridade primeiro.
  RETURN QUERY
  SELECT
    m.codbarras,
    m.codinterno,
    m.nome
  FROM
    public.medicines AS m
  WHERE
    m.nome % search_term
  ORDER BY
    similarity(m.nome, search_term) DESC,
    m.nome;
END;
$$ LANGUAGE plpgsql;

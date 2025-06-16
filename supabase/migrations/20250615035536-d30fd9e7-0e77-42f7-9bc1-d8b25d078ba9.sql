
-- Atualiza a função de busca para ser mais "flexível" com erros de digitação.
-- A função set_limit(0.2) diminui o nível de similaridade exigido,
-- garantindo que buscas como "propanolol" encontrem "propranolol".
-- Essa configuração só afeta esta busca, não o banco de dados inteiro.
CREATE OR REPLACE FUNCTION search_medicines_by_name(search_term TEXT)
RETURNS TABLE(codbarras TEXT, codinterno TEXT, nome TEXT) AS $$
BEGIN
  -- Define um limite de similaridade mais baixo (0.2) para esta busca específica.
  -- O padrão é 0.3. Isso torna a busca mais tolerante a erros de digitação.
  PERFORM set_limit(0.2);

  RETURN QUERY
  SELECT
    m.codbarras,
    m.codinterno,
    m.nome
  FROM
    public.medicines AS m
  WHERE
    -- A busca continua case-insensitive e agora usa o novo limite de similaridade.
    lower(m.nome) % lower(search_term)
  ORDER BY
    -- A ordenação por similaridade também ignora o case.
    similarity(lower(m.nome), lower(search_term)) DESC,
    m.nome;
END;
$$ LANGUAGE plpgsql;

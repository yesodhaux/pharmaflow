
-- Cria a tabela para armazenar as informações dos medicamentos
CREATE TABLE public.medicines (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    codbarras TEXT UNIQUE NOT NULL,
    codinterno TEXT,
    nome TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilita a Segurança em Nível de Linha (RLS)
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;

-- Cria uma política para permitir que qualquer pessoa (usuários anônimos e autenticados) leia os dados dos medicamentos.
-- Isso é necessário para que a funcionalidade de busca funcione.
CREATE POLICY "Allow public read access to medicines"
ON public.medicines
FOR SELECT
USING (true);

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE portfolio_documents (
  id BIGSERIAL PRIMARY KEY,
  source_type TEXT NOT NULL,
  source_id INTEGER NOT NULL,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  embedding VECTOR(1536) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT portfolio_documents_source_unique UNIQUE (source_type, source_id, locale)
);

CREATE INDEX IF NOT EXISTS portfolio_documents_embedding_ivfflat_idx
  ON portfolio_documents
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS portfolio_documents_source_idx
  ON portfolio_documents (source_type, source_id, locale);

CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1536),
  match_count INT DEFAULT 5,
  filter JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  id BIGINT,
  source_type TEXT,
  source_id INTEGER,
  locale TEXT,
  title TEXT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.source_type,
    d.source_id,
    d.locale,
    d.title,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM portfolio_documents AS d
  WHERE d.metadata @> filter
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

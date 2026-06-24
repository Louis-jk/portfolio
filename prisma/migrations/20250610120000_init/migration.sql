-- CreateExtension
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE IF NOT EXISTS "projects" (
    "id" SERIAL NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "image_url" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "technologies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "platform_categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "domain_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "title" JSONB NOT NULL,
    "company" JSONB NOT NULL,
    "role" JSONB NOT NULL,
    "overview" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "challenges" JSONB NOT NULL,
    "achievements" JSONB NOT NULL,
    "platforms" JSONB NOT NULL,
    "tools" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable (RAG — may already exist from an earlier migration)
CREATE TABLE IF NOT EXISTS "portfolio_documents" (
    "id" BIGSERIAL NOT NULL,
    "source_type" TEXT NOT NULL,
    "source_id" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "embedding" vector(1536) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT "portfolio_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "portfolio_documents_source_idx" ON "portfolio_documents"("source_type", "source_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "portfolio_documents_source_unique" ON "portfolio_documents"("source_type", "source_id", "locale");

CREATE INDEX IF NOT EXISTS portfolio_documents_embedding_ivfflat_idx
  ON portfolio_documents
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

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

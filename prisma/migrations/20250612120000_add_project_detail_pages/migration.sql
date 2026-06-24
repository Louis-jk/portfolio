-- CreateTable
CREATE TABLE IF NOT EXISTS "project_detail_pages" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "content" JSONB NOT NULL DEFAULT '{}',
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_detail_pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "project_detail_pages_project_id_key" ON "project_detail_pages"("project_id");

-- AddForeignKey (skip if already present)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'project_detail_pages_project_id_fkey'
  ) THEN
    ALTER TABLE "project_detail_pages" ADD CONSTRAINT "project_detail_pages_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

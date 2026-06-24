-- AlterTable
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "region" JSONB NOT NULL DEFAULT '{"ko":"","ja":"","en":""}'::jsonb;

-- Remove default so new rows must supply region via application
ALTER TABLE "projects" ALTER COLUMN "region" DROP DEFAULT;

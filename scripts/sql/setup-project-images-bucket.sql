-- Run in Supabase SQL Editor if admin image upload returns "Bucket not found".
-- Creates the public bucket used by upload-image.ts / upload-video.ts.

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public;

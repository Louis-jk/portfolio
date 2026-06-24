-- Mirror table for Supabase Realtime: exposes only project_id + is_public (no story JSONB).
-- Kept in sync via trigger on project_detail_pages.

CREATE TABLE IF NOT EXISTS public.story_visibility (
    project_id INTEGER NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT story_visibility_pkey PRIMARY KEY (project_id),
    CONSTRAINT story_visibility_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE OR REPLACE FUNCTION public.sync_story_visibility_from_detail_page()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        DELETE FROM public.story_visibility WHERE project_id = OLD.project_id;
        RETURN OLD;
    END IF;

    INSERT INTO public.story_visibility (project_id, is_public, updated_at)
    VALUES (NEW.project_id, NEW.is_public, CURRENT_TIMESTAMP)
    ON CONFLICT (project_id) DO UPDATE
        SET is_public = EXCLUDED.is_public,
            updated_at = EXCLUDED.updated_at;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_story_visibility ON public.project_detail_pages;

CREATE TRIGGER trg_sync_story_visibility
    AFTER INSERT OR UPDATE OR DELETE ON public.project_detail_pages
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_story_visibility_from_detail_page();

INSERT INTO public.story_visibility (project_id, is_public, updated_at)
SELECT project_id, is_public, updated_at
FROM public.project_detail_pages
ON CONFLICT (project_id) DO UPDATE
    SET is_public = EXCLUDED.is_public,
        updated_at = EXCLUDED.updated_at;

ALTER TABLE public.story_visibility ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS story_visibility_public_read ON public.story_visibility;

CREATE POLICY story_visibility_public_read
    ON public.story_visibility
    FOR SELECT
    TO anon, authenticated
    USING (true);

GRANT SELECT ON public.story_visibility TO anon, authenticated;

ALTER TABLE public.story_visibility REPLICA IDENTITY FULL;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.story_visibility;
        EXCEPTION
            WHEN duplicate_object THEN NULL;
        END;
    END IF;
END $$;

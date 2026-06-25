-- Mirror table for Supabase Realtime: signals project catalog changes without exposing JSONB i18n.
-- Kept in sync via trigger on projects.

CREATE TABLE IF NOT EXISTS public.project_catalog_signals (
    project_id INTEGER NOT NULL,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT project_catalog_signals_pkey PRIMARY KEY (project_id),
    CONSTRAINT project_catalog_signals_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE OR REPLACE FUNCTION public.sync_project_catalog_signal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;

    INSERT INTO public.project_catalog_signals (project_id, updated_at)
    VALUES (NEW.id, CURRENT_TIMESTAMP)
    ON CONFLICT (project_id) DO UPDATE
        SET updated_at = EXCLUDED.updated_at;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_project_catalog_signal ON public.projects;

CREATE TRIGGER trg_sync_project_catalog_signal
    AFTER INSERT OR UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_project_catalog_signal();

INSERT INTO public.project_catalog_signals (project_id, updated_at)
SELECT id, updated_at
FROM public.projects
ON CONFLICT (project_id) DO UPDATE
    SET updated_at = EXCLUDED.updated_at;

ALTER TABLE public.project_catalog_signals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS project_catalog_signals_public_read ON public.project_catalog_signals;

CREATE POLICY project_catalog_signals_public_read
    ON public.project_catalog_signals
    FOR SELECT
    TO anon, authenticated
    USING (true);

GRANT SELECT ON public.project_catalog_signals TO anon, authenticated;

ALTER TABLE public.project_catalog_signals REPLICA IDENTITY FULL;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.project_catalog_signals;
        EXCEPTION
            WHEN duplicate_object THEN NULL;
        END;
    END IF;
END $$;

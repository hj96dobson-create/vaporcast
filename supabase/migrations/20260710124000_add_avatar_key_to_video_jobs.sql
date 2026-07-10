ALTER TABLE public.video_jobs
ADD COLUMN IF NOT EXISTS avatar_key text NOT NULL DEFAULT 'avatar-1';

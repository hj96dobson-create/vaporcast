CREATE TABLE IF NOT EXISTS public.avatar_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, avatar_key)
);

CREATE TABLE IF NOT EXISTS public.avatar_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_key text NOT NULL,
  voice text NOT NULL,
  language text NOT NULL,
  personality text NOT NULL,
  style text NOT NULL,
  emotion text NOT NULL,
  background text NOT NULL,
  script text NOT NULL,
  source text NOT NULL DEFAULT 'selected',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.avatar_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  avatar_key text NOT NULL,
  voice text NOT NULL,
  language text NOT NULL,
  style text NOT NULL,
  emotion text NOT NULL,
  background text NOT NULL,
  script text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  video_job_id uuid REFERENCES public.video_jobs(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.avatar_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatar_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatar_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their avatar favorites"
ON public.avatar_favorites
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their avatar history"
ON public.avatar_history
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their avatar projects"
ON public.avatar_projects
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
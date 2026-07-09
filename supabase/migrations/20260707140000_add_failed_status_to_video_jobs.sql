-- Add 'failed' status to video_jobs table to handle Runway API failures
ALTER TABLE public.video_jobs 
DROP CONSTRAINT IF EXISTS video_jobs_status_check;

ALTER TABLE public.video_jobs 
ADD CONSTRAINT video_jobs_status_check 
CHECK (status IN ('processing', 'complete', 'failed'));

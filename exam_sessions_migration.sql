-- Run this in your Supabase SQL editor

-- If creating fresh:
CREATE TABLE IF NOT EXISTS public.exam_sessions (
  candidate_id text NOT NULL,
  candidate_name text NOT NULL,
  exam_id uuid,
  exam_name text,
  room_id text,
  candidate_room_id text,
  question_index integer DEFAULT 0,
  total_questions integer DEFAULT 0,
  warnings integer DEFAULT 0,
  status text DEFAULT 'live',
  started_at timestamp with time zone DEFAULT now(),
  CONSTRAINT exam_sessions_pkey PRIMARY KEY (candidate_id),
  CONSTRAINT exam_sessions_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id)
);

-- If table already exists, run these:
ALTER TABLE public.exam_sessions ALTER COLUMN room_id DROP NOT NULL;
ALTER TABLE public.exam_sessions ADD COLUMN IF NOT EXISTS candidate_room_id text;

-- Enable realtime on this table (required for live updates)
ALTER TABLE public.exam_sessions REPLICA IDENTITY FULL;

-- Add to supabase realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.exam_sessions;

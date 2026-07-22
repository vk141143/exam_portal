-- Run this in your Supabase SQL editor

CREATE TABLE public.exam_sessions (
  candidate_id text NOT NULL,
  candidate_name text NOT NULL,
  exam_id uuid,
  exam_name text,
  room_id text NOT NULL,
  question_index integer DEFAULT 0,
  total_questions integer DEFAULT 0,
  warnings integer DEFAULT 0,
  status text DEFAULT 'live',
  started_at timestamp with time zone DEFAULT now(),
  CONSTRAINT exam_sessions_pkey PRIMARY KEY (candidate_id),
  CONSTRAINT exam_sessions_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id)
);

-- Enable realtime on this table (required for live updates)
ALTER TABLE public.exam_sessions REPLICA IDENTITY FULL;

-- Add to supabase realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.exam_sessions;

-- Exécuter une seule fois dans Supabase SQL Editor.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tx_review_notified_at timestamptz;

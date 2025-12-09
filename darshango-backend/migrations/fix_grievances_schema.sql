-- Add attachments column to grievances table if it doesn't exist
ALTER TABLE grievances
ADD COLUMN IF NOT EXISTS attachments text[] DEFAULT '{}';

-- Fix constraints if any for type/priority
ALTER TABLE grievances ALTER COLUMN priority SET DEFAULT 'Normal';

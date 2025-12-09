-- Add component column to funds table
ALTER TABLE funds
ADD COLUMN IF NOT EXISTS component text;

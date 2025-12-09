-- Run this script in Supabase SQL Editor to fix the "Failed to submit" error

-- 1. Add missing columns for General Grievances
ALTER TABLE grievances
ADD COLUMN IF NOT EXISTS is_general boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS level text,
ADD COLUMN IF NOT EXISTS source text,
ADD COLUMN IF NOT EXISTS component text,
ADD COLUMN IF NOT EXISTS district text,
ADD COLUMN IF NOT EXISTS sla_due_date timestamptz,
ADD COLUMN IF NOT EXISTS sla_status text DEFAULT 'On Track',
ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES users(id),
ADD COLUMN IF NOT EXISTS verified_at timestamptz,
ADD COLUMN IF NOT EXISTS reopened_at timestamptz;

-- 2. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_grievances_component ON grievances(component);
CREATE INDEX IF NOT EXISTS idx_grievances_district ON grievances(district);
CREATE INDEX IF NOT EXISTS idx_grievances_status ON grievances(status);

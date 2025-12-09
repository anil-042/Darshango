-- Migration to add new fields to grievances table

ALTER TABLE grievances
ADD COLUMN is_general boolean DEFAULT false,
ADD COLUMN category text, -- Fund Delay, Policy Issue, etc.
ADD COLUMN level text, -- Central-State, etc.
ADD COLUMN source text, -- Public, Agency, etc.
ADD COLUMN component text, -- For filtering
ADD COLUMN district text, -- For filtering
ADD COLUMN sla_due_date timestamptz,
ADD COLUMN sla_status text DEFAULT 'On Track', -- On Track, Overdue, Near Breach
ADD COLUMN verified_by uuid REFERENCES users(id),
ADD COLUMN verified_at timestamptz,
ADD COLUMN reopened_at timestamptz;

-- Make project_id nullable for general grievances
ALTER TABLE grievances ALTER COLUMN project_id DROP NOT NULL;

-- Update type column to support more values if restricted, or just use text which it is
-- Add index for filtering
CREATE INDEX idx_grievances_component ON grievances(component);
CREATE INDEX idx_grievances_district ON grievances(district);
CREATE INDEX idx_grievances_status ON grievances(status);

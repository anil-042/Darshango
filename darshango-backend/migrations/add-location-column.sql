-- Add location text column to inspections
ALTER TABLE inspections
ADD COLUMN IF NOT EXISTS location TEXT;

-- Index for searching by location if needed
CREATE INDEX IF NOT EXISTS idx_inspections_location ON inspections(location);

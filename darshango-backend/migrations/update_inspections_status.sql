-- Update check constraint for inspections status to include 'Reported'
ALTER TABLE inspections DROP CONSTRAINT IF EXISTS inspections_status_check;

ALTER TABLE inspections 
ADD CONSTRAINT inspections_status_check 
CHECK (status IN ('Scheduled', 'Completed', 'Pending', 'Reported'));

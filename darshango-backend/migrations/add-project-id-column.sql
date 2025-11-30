-- Migration: Add project_id column to projects table
-- This allows storing user-friendly project IDs separate from the database UUID

-- Add the project_id column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS project_id VARCHAR(255);

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_project_id 
ON projects(project_id);

-- Optional: Update existing projects with their database ID as project_id
-- Uncomment the line below if you want to populate existing records
-- UPDATE projects SET project_id = id WHERE project_id IS NULL;

-- Add village column to agencies table
ALTER TABLE agencies
ADD COLUMN village text;

-- Add village column to projects table
ALTER TABLE projects
ADD COLUMN village text;

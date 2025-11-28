# Firestore Indexes

This file lists the required composite indexes to support the application's queries. You can deploy these via the Firebase Console or `firestore.indexes.json`.

## Projects
- **Collection**: `projects`
  - Fields: `state` (Ascending), `status` (Ascending), `updatedAt` (Descending)
  - Fields: `district` (Ascending), `status` (Ascending), `updatedAt` (Descending)
  - Fields: `implementingAgencyId` (Ascending), `component` (Ascending), `updatedAt` (Descending)
  - Fields: `status` (Ascending), `updatedAt` (Descending)

## Funds
- **Collection**: `funds` (and `projects/{id}/funds`)
  - Fields: `projectId` (Ascending), `date` (Descending)
  - Fields: `projectId` (Ascending), `ucStatus` (Ascending), `date` (Descending)
  - Fields: `ucStatus` (Ascending), `date` (Descending)

## Milestones
- **Collection**: `projects/{id}/milestones`
  - Fields: `orderIndex` (Ascending) (Single field index usually sufficient, but composite might be needed if filtering)

## Documents
- **Collection**: `projects/{id}/documents`
  - Fields: `projectId` (Ascending), `category` (Ascending), `uploadedAt` (Descending)
  - Fields: `projectId` (Ascending), `uploadedAt` (Descending)

## Inspections
- **Collection**: `projects/{id}/inspections`
  - Fields: `projectId` (Ascending), `severity` (Ascending), `date` (Descending)
  - Fields: `projectId` (Ascending), `date` (Descending)

## Alerts
- **Collection**: `alerts`
  - Fields: `projectId` (Ascending), `status` (Ascending), `createdAt` (Descending)
  - Fields: `projectId` (Ascending), `priority` (Ascending), `createdAt` (Descending)
  - Fields: `status` (Ascending), `priority` (Ascending), `createdAt` (Descending)

## Collection Group Indexes
- **Collection ID**: `milestones`
  - Fields: `createdAt` (Descending)
- **Collection ID**: `funds`
  - Fields: `date` (Descending)
- **Collection ID**: `inspections`
  - Fields: `date` (Descending)
- **Collection ID**: `documents`
  - Fields: `uploadedAt` (Descending)

# PM-AJAY Dashboard - Backend Architecture & Workflow Overview

This document provides a technical overview of the **DarshanGo Backend**, explaining how the server processes requests, manages data, and integrates with external services.

## 1. Technology Stack

*   **Runtime Environment**: Node.js
*   **Framework**: Express.js (for handling HTTP requests and routing)
*   **Language**: TypeScript (for type safety and maintainability)
*   **Database**: Supabase (PostgreSQL)
    *   *Note: The project has migrated from Firebase Firestore to Supabase for relational data management.*
*   **Authentication**: JWT (JSON Web Tokens) & Supabase Auth
*   **File Storage**: Supabase Storage (for documents and inspection photos)
*   **External Integrations**: n8n (for AI Chat Assistant)

---

## 2. Architecture Pattern

The backend follows a **Modular Layered Architecture**. Each feature (e.g., Projects, Agencies) is encapsulated in its own module containing:

1.  **Routes** (`*.routes.ts`): Defines the API endpoints (e.g., `GET /projects`, `POST /chat`).
2.  **Controllers** (`*.controller.ts`): Handles the HTTP request/response logic. It validates input, calls the service layer, and sends back JSON responses.
3.  **Services** (`*.service.ts`): Contains the business logic and interacts with the database (Supabase).
4.  **Interfaces/DTOs**: Defines the shape of data for type safety.

### Directory Structure
```
src/
├── modules/
│   ├── auth/           # User authentication & registration
│   ├── projects/       # Project lifecycle management
│   ├── agencies/       # Agency onboarding & mapping
│   ├── funds/          # Fund flow tracking & transactions
│   ├── inspections/    # Inspection reports & photo uploads
│   ├── chat/           # AI Assistant proxy (n8n integration)
│   └── ...
├── middleware/         # Auth checks, error handling, logging
├── utils/              # Helper functions (response formatting, etc.)
└── app.ts              # App entry point, middleware setup
```

---

## 3. Key Workflows

### A. Request Processing Flow
When the Frontend sends a request (e.g., "Create a Project"):

1.  **Entry**: The request hits `server.ts` -> `app.ts`.
2.  **Middleware**: Global middleware (CORS, Helmet) runs.
3.  **Routing**: `routes.ts` directs the request to the specific module (e.g., `project.routes.ts`).
4.  **Auth Check**: `authMiddleware` verifies the JWT token to ensure the user is logged in and has the right permissions (RBAC).
5.  **Controller**: `projectController.create` receives the request body.
6.  **Service**: `projectService.create` validates the business rules (e.g., "Is budget valid?") and runs the SQL query via Supabase client.
7.  **Response**: The data is returned to the Controller, which sends a `201 Created` JSON response to the Frontend.

### B. AI Chat Assistant Flow (New)
1.  **User Input**: User types "Hello" in the frontend chatbox.
2.  **Frontend**: Sends POST request to `/api/v1/chat`.
3.  **Backend Proxy**: `chatController` receives the message.
4.  **n8n Integration**: The controller forwards the message + `sessionId` to the **n8n Webhook URL**.
5.  **Processing**: n8n processes the intent (using AI/LLM) and generates a response.
6.  **Response**: n8n returns the text to the Backend, which relays it to the Frontend.

### C. Fund Flow Tracking
1.  **Transaction**: When a fund is released, a record is created in the `funds` table.
2.  **Linking**: The transaction is linked to a specific `projectId` and `agencyId`.
3.  **Calculation**: The backend aggregates these transactions to calculate "Total Utilized" vs "Total Sanctioned" for the dashboard KPIs.

---

## 4. Security Measures

*   **JWT Authentication**: Stateless authentication using secure tokens.
*   **Role-Based Access Control (RBAC)**:
    *   *Admin*: Can manage users, agencies, and all projects.
    *   *Nodal Officer*: Can view and update projects in their jurisdiction.
    *   *Agency*: Can only view assigned projects and upload UCs.
*   **Input Validation**: Zod schemas are used to validate incoming data.
*   **Helmet**: Sets secure HTTP headers to prevent common attacks.
*   **CORS**: Configured to allow requests only from the trusted frontend domain.

---

## 5. Database Schema (Supabase)

The relational schema includes tables for:
*   `users` (id, email, role, district)
*   `projects` (id, name, budget, status, agency_id)
*   `agencies` (id, name, type, registration_no)
*   `funds` (id, project_id, amount, type, date)
*   `inspections` (id, project_id, officer_name, report, photos)

---

This architecture ensures scalability, maintainability, and secure data handling for the PM-AJAY Central Monitoring System.

# DarshanGo Backend

Backend API for the PM-AJAY Dashboard (DarshanGo).

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Auth**: JWT & Firebase Admin

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    PORT=5000
    FIREBASE_PROJECT_ID=your-project-id
    FIREBASE_CLIENT_EMAIL=your-client-email
    FIREBASE_PRIVATE_KEY="your-private-key"
    FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
    JWT_SECRET=your_secret_key
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Build for Production**
    ```bash
    npm run build
    npm start
    ```

## API Documentation

### Auth
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user

### Projects
- `GET /api/v1/projects` - Get all projects
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects/:id` - Get project details
- `PATCH /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

### Sub-Resources
- `POST /api/v1/projects/:id/milestones` - Add milestone
- `POST /api/v1/projects/:id/funds` - Add fund transaction
- `POST /api/v1/projects/:id/inspections` - Schedule inspection
- `POST /api/v1/projects/:id/documents` - Upload document

## Data Flow
The backend follows a modular architecture:
1.  **Controller**: Handles HTTP requests and responses.
2.  **Service**: Contains business logic and interacts with Firestore.
3.  **Firestore**: Stores data in collections (`users`, `projects`, `agencies`).

## Security
- **JWT Authentication**: All protected routes require a valid Bearer token.
- **RBAC**: Role-based access control ensures only authorized users can perform sensitive actions.

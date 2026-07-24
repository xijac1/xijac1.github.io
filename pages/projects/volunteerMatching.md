Github: https://github.com/xijac1/software-design-project
# Tech Stack

This project is a volunteer management web app built as a full-stack product. The frontend focuses on a guided user experience for volunteers and administrators, while the backend handles authentication, data workflows, reporting, and notifications.

## What The App Does

The app is designed around a few core user journeys:

- Volunteers can register, log in, complete their profile, view notifications, and track volunteer history.
- Administrators can manage events, match volunteers, view dashboards, and work with reporting tools.
- Users are routed based on authentication state, role, and profile completion status.
- The app supports a temporary demo mode for local development so pages can be explored without a live login.

## Feature Showcase

### Authentication And Access Control

The login and registration flows are supported by Firebase on the client and Firebase Admin on the server. Route protection is handled with React Router and custom route guards for private pages, profile-completion flows, and administrator-only pages.

Technologies used:

- React
- react-router-dom
- firebase
- firebase-admin
- Express
- localStorage for session persistence

### Profile Completion Flow

The app checks whether a user has completed their profile before allowing access to certain pages. If profile data is incomplete, the user is redirected through a dedicated phantom page and prompted to complete the profile.

Technologies used:

- React state and effects
- Custom route guards
- Fetch and Axios for backend checks
- Material UI for form and layout components

### Volunteer Experience

Volunteers can access a homepage, profile page, notifications, and volunteer history. The interface is built to make navigation simple, with a persistent navbar and role-aware buttons.

Technologies used:

- React
- Material UI
- @mui/icons-material
- @mui/x-data-grid for structured data views
- react-select for selection controls

### Administrator Tools

Administrators get access to event management, volunteer matching, and an admin dashboard. These pages are hidden from regular volunteers and exposed only when the user role is admin or administrator.

Technologies used:

- Custom role-based route guards
- React Router
- Material UI
- Express backend routes
- Supabase and database-backed APIs where applicable

### Notifications And Messaging

The app includes a notifications page and supports Firebase messaging so the UI can receive push notifications and display them in-app.

Technologies used:

- Firebase Cloud Messaging
- firebase messaging client support
- Service worker support in the frontend
- Snackbar and Alert components from Material UI

### Reporting And Export Workflows

The backend includes reporting functionality and export support, which is useful for admin workflows and operational summaries.

Technologies used:

- pdfkit for PDF output
- csv-writer for CSV exports
- Express routes and controllers
- Jest and supertest for verification

## Technology Map

### Frontend

- React 19 for the single-page application
- react-router-dom for routing and guarded navigation
- react-scripts for development and production builds
- @mui/material and @mui/icons-material for the UI system
- @emotion/react and @emotion/styled for styling and customization
- @mui/x-data-grid for tables and structured lists
- react-select for rich dropdowns
- firebase for auth and push messaging
- axios for API calls
- @supabase/supabase-js for Supabase integration
- web-vitals for performance metrics

### Backend

- Node.js as the server runtime
- Express 5 for the API layer
- firebase-admin for secure server-side Firebase integration
- dotenv for configuration
- cors for cross-origin browser requests
- bcryptjs for password hashing
- axios for external HTTP requests
- @supabase/supabase-js for Supabase integration
- pdfkit for document generation
- csv-writer for CSV exports
- nodemon for development restarts
- Jest and supertest for tests

## Project Structure

- `frontend/` contains the React application.
- `backend/` contains the Express server and backend tests.
- `src/` at the repo root contains server and shared source files used by the backend.
- `tests/` contains backend test files.

## How To Run

### Install dependencies

```bash
npm install
npm run setup
```

### Run both apps

```bash
npm run dev
```

### Run frontend only

```bash
cd frontend
npm start
```

### Run backend only

```bash
cd backend
npm run dev
```

### Run backend tests

```bash
cd backend
npm test
```

## Notes

- The root package scripts use `concurrently` to launch both services together.
- The frontend currently supports a temporary demo mode for local development.
- Backend coverage reports are available under `backend/coverage/lcov-report/index.html`.
# EVision Project README

EVision is an enterprise EV charging network management application. It helps operators monitor charging stations, track live charging sessions, review analytics, manage users, receive alerts, and inspect station health from a single web dashboard.

This document explains the project purpose, technology stack, local setup, scripts, environment variables, and basic development workflow.

## Project Overview

EVision is built as a MERN-style application with a TypeScript backend and a modern Next.js frontend.

Core capabilities include:

- Dashboard for network KPIs, station health, revenue, and energy usage
- Charging station listing, status tracking, capacity, connector, and location data
- Charging session monitoring
- Analytics views with charts and operational metrics
- Notification and alert management
- User administration with role-based access
- JWT-based authentication
- Real-time updates through Socket.IO
- MongoDB-backed data persistence

## Tech Stack

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Redux Toolkit
- TanStack React Query
- Axios
- Socket.IO Client
- React Hook Form
- Zod
- Recharts
- Leaflet and React Leaflet
- Lucide React icons

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB
- Mongoose
- Socket.IO
- JWT authentication
- bcryptjs
- Zod validation
- Helmet
- CORS
- Morgan
- dotenv

### Tooling

- npm
- TypeScript
- ESLint
- tsx for backend development
- Next.js Turbopack for frontend development

## Project Structure

```text
chargerTracking/
  backend/
    src/
      config/          Backend configuration
      controllers/     API request handlers
      middleware/      Auth and error middleware
      models/          Mongoose models
      routes/          Express route definitions
      services/        Data mappers and token logic
      socket/          Socket.IO server setup
      validators/      Shared request validation helpers
      app.ts           Express app configuration
      server.ts        Backend server entry point
    package.json

  frontend/
    src/
      app/             Next.js App Router pages and layouts
      components/      Shared UI and layout components
      constants/       Navigation constants
      features/        Feature-level views
      hooks/           Redux hooks
      services/        API and socket clients
      store/           Redux store and slices
      styles/          Global styles
      types/           Shared frontend types
      utils/           Utility helpers
    package.json

  docs/
    SRS.md             Software Requirements Specification
    README.md          Project setup and overview
```

## Prerequisites

Install the following before running the project:

- Node.js 20 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string

The default backend configuration expects MongoDB at:

```text
mongodb://127.0.0.1:27017/evision
```

## Local Setup

Clone the project and open the root folder:

```bash
cd chargerTracking
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Environment Variables

Create a `.env` file inside the `backend` folder:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/evision
CLIENT_ORIGIN=http://localhost:3000
JWT_ACCESS_SECRET=development-access-secret-change-me
JWT_REFRESH_SECRET=development-refresh-secret-change-me
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

Create a `.env.local` file inside the `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

For production, replace the JWT secrets with strong private values and point the frontend variables to the deployed backend URL.

## Running the App

Start MongoDB first.

In one terminal, run the backend:

```bash
cd backend
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Health check endpoint:

```text
http://localhost:5000/api/health
```

In another terminal, run the frontend:

```bash
cd frontend
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

## Available Scripts

### Backend

```bash
npm run dev      # Start backend in watch mode
npm run build    # Compile TypeScript
npm run start    # Build and start compiled backend
npm run lint     # Run ESLint
```

### Frontend

```bash
npm run dev      # Start Next.js development server
npm run build    # Build frontend for production
npm run start    # Start production frontend server
npm run lint     # Run Next.js lint command
```

## API Modules

The backend exposes routes under `/api`:

- `/api/health`
- `/api/auth`
- `/api/dashboard`
- `/api/stations`
- `/api/sessions`
- `/api/analytics`
- `/api/notifications`
- `/api/users`
- `/api/settings`

The frontend API client is located at:

```text
frontend/src/services/api.ts
```

The frontend Socket.IO client is located at:

```text
frontend/src/services/socket.ts
```

## Development Workflow

Recommended local workflow:

1. Start MongoDB.
2. Start the backend with `npm run dev`.
3. Start the frontend with `npm run dev`.
4. Open `http://localhost:3000`.

## Build Check

Before sharing or deploying changes, run:

```bash
cd backend
npm run build
```

```bash
cd frontend
npm run build
```

These commands verify that both applications compile successfully.

## Notes

- The backend defaults are development-friendly, but production deployments must use secure JWT secrets.
- The frontend expects the backend API and Socket.IO server to be reachable through public environment variables.
- The project currently has separate `package.json` files for backend and frontend, so dependency installation and scripts are run from each folder separately.
- The SRS is available at `docs/SRS.md` for detailed product requirements.

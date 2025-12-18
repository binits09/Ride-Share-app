# REBU RIDE — Modern Ride‑Sharing App

A full‑stack ride‑sharing application with role‑based access (User, Driver, Admin), real‑time routing and ETA, professional UI, in‑app toasts, and an AI assistant that understands the project domain.

## Overview
- Book rides with pickup/dropoff suggestions and instant route preview
- Live fare estimate and ride options (bike/car) computed from distance
- Driver workflow: go online, accept rides, arrive, start, complete, and mark paid
- Clean notifications via professional Toast UI (no browser alerts)
- AI chatbot (Gemini) informed by project context for support and Q&A
- Secure auth via JWT; backend built on Node.js + Express + MongoDB
- Maps and routing powered by OpenStreetMap + OpenRouteService

## Tech Stack
- Backend: Node.js, Express, MongoDB/Mongoose, JWT, Multer
- Frontend: React (Vite), Context API, modern utility‑class styling
- Maps: Leaflet (via `MapView`) with OSM tiles, Nominatim for geocoding, OpenRouteService for routes
- AI: Google Generative AI SDK (Gemini) via backend controller

## Repository Structure
```
backend/
  server.js
  package.json
  config/
    db.js
    multer.js
  controllers/
    authController.js
    rideController.js
    paymentController.js
    aiController.js
    userUpdate.js
    driverUpdate.js
  middleware/
    authMiddleware.js
  models/
    User.js
    Driver.js
    Ride.js
  routes/
    authRoutes.js
    rideRoutes.js
    driverRoutes.js
    paymentRoutes.js
    userRoutes.js
    aiRoutes.js

frontend/
  package.json
  vite.config.js
  index.html
  public/
  src/
    App.jsx
    main.jsx
    pages/
      Home.jsx
      Ride.jsx
      DriverHome.jsx
      DriverUI.jsx
    components/
      Navbar.jsx
      MapView.jsx
      Login.jsx
      Register.jsx
      DriverRegister.jsx
      Toast.jsx
    context/
      AuthContext.jsx
    accountPages/
      driverAcc/
        Earnings.jsx
        PersonalInfo.jsx
        Vehicle.jsx
        Security.jsx
      userAcc/
        PersonalInfo.jsx
        Security.jsx
```

### Folder Guide

- Backend
  - [backend/server.js](backend/server.js): Express app setup, middleware, and route mounting.
  - [backend/config](backend/config): App configuration — [db.js](backend/config/db.js) connects MongoDB, [multer.js](backend/config/multer.js) handles file uploads.
  - [backend/middleware](backend/middleware): Shared middlewares — [authMiddleware.js](backend/middleware/authMiddleware.js) protects routes using JWT.
  - [backend/models](backend/models): Mongoose schemas — [User.js](backend/models/User.js), [Driver.js](backend/models/Driver.js), [Ride.js](backend/models/Ride.js).
  - [backend/controllers](backend/controllers): Request handlers containing business logic (auth, rides, payments, AI, profile updates).
  - [backend/routes](backend/routes): Express routers that expose API endpoints and connect to controllers.
  - [backend/uploads](backend/uploads): Uploaded files (e.g., driver profile pictures), served by the backend.

- Frontend
  - [frontend/src/main.jsx](frontend/src/main.jsx): App bootstrap; mounts React and Router.
  - [frontend/src/App.jsx](frontend/src/App.jsx): Route definitions (pages and protected routes).
  - [frontend/src/pages](frontend/src/pages): Top-level views (Home, Ride flow, Driver areas).
  - [frontend/src/components](frontend/src/components): Reusable UI parts (Navbar, Toast, MapView, forms).
  - [frontend/src/context](frontend/src/context): Global state like [AuthContext.jsx](frontend/src/context/AuthContext.jsx).
  - [frontend/src/services](frontend/src/services): API clients ([api.js](frontend/src/services/api.js), [driverApi.js](frontend/src/services/driverApi.js)).
  - [frontend/src/utils](frontend/src/utils): Helpers such as [PrivateRoute.jsx](frontend/src/utils/PrivateRoute.jsx).
  - [frontend/src/accountPages](frontend/src/accountPages): Per-role account sections for drivers and users.
  - [frontend/src/layouts](frontend/src/layouts): Layout helpers and dropdown menu components.

### How Things Connect
- Requests hit [routes](backend/routes) → call the right [controllers](backend/controllers) → read/write via [models](backend/models) → return JSON to the frontend.
- Frontend calls the backend via [services](frontend/src/services), renders [pages](frontend/src/pages) using shared [components](frontend/src/components), and keeps auth in [context](frontend/src/context).
- Mapping uses `MapView` with OSM tiles; geocoding and routing are handled server-side or via service calls.

## Prerequisites
- Node.js 18+ (recommended 20/22/24)
- MongoDB (local or cloud, e.g., Atlas)
- A valid OpenRouteService API key for routing
- Optional: Google API key for the AI assistant; Razorpay keys if payments are enabled

## Environment Setup
Create `.env` files for backend and frontend.

Backend `.env` example:
```
PORT=6200
MONGODB_URI=mongodb://127.0.0.1:27017/rebu_ride
JWT_SECRET=replace-with-strong-secret
# Optional integrations
GOOGLE_API_KEY=your-google-api-key
CORS_ORIGIN=http://localhost:5173
```

Frontend `.env` example:
```
VITE_API_URL=http://localhost:6200
VITE_ORS_KEY=your-openrouteservice-key
```

## Quick Start
Open two terminals (one for backend, one for frontend).

Backend (PowerShell or bash):
```bash
cd backend
npm install
npm run start
# or: node server.js
```

Frontend (PowerShell or bash):
```bash
cd frontend
npm install
npm run dev
```
- Backend runs on `http://localhost:6200`
- Frontend runs on Vite dev server (usually `http://localhost:5173`)

## Core Flows
- User booking
  - Enter pickup/dropoff; type‑ahead suggestions via Nominatim
  - Click Search → route and options are computed via OpenRouteService
  - Pick a ride option → request sent; track status in Ride page
- Driver workflow
  - Go online → see available/searching rides
  - Claim/accept → arrive at pickup → start → complete → mark paid

## Role‑Based Access
- User: book rides, view history, chat with AI
- Driver: accept and complete rides, view earnings
- Admin: reserved for management (routes hidden from Navbar for normal users)

## API Overview (selected)
- Auth
  - POST `/api/auth/register`, POST `/api/auth/login`, GET `/api/auth/me`
- Rides (User)
  - POST `/api/rides/request` — create a ride request
  - GET `/api/rides/my` — latest ride status
  - PUT `/api/rides/:id/cancel` — cancel ride
- Rides (Driver)
  - GET `/api/rides/driver` — list relevant rides (searching + assigned)
  - POST `/api/rides/claim` — claim next searching ride
  - PUT `/api/rides/:id/accept` — accept ride
  - PUT `/api/rides/:id/reject` — reject ride
  - PUT `/api/rides/:id/arrive` — mark arrived
  - PUT `/api/rides/:id/start` — start ride
  - PUT `/api/rides/:id/complete` — complete ride
  - GET `/api/rides/driver/summary` — totals and today’s earnings
- Payments
  - See `backend/controllers/paymentController.js` and `backend/routes/paymentRoutes.js`
- AI Assistant
  - Routes mounted under `/api/ai` (see `backend/controllers/aiController.js` and `backend/routes/aiRoutes.js`)

## Frontend Highlights
- Professional Toast notifications (`frontend/src/components/Toast.jsx`) with a `useToast` hook
- Booking card with glow/shadow, polished inputs with icons
- Map and route display (`frontend/src/components/MapView.jsx`)
- AI Chat UI page with example prompts and typing indicator

## Development Notes
- Auth middleware attaches `req.user` from JWT; protect routes via `authMiddleware.js`
- Ride statuses: searching → requested → accepted → arrived → ongoing → completed → paid
- Geocoding: Nominatim search; Routing: OpenRouteService; Map: Leaflet + OSM tiles
- AI: Google Generative AI SDK (Gemini); contextual system prompt for project‑aware answers

## Troubleshooting
- Blank frontend page: ensure JSX is balanced (recent fixes in Home.jsx)
- Gradient class warnings: environment may prefer `bg-linear-to-*`; optional normalization
- AI errors: verify `GOOGLE_API_KEY`, backend `/api/ai` route mounted, and SDK installed
- Routing issues: ensure `VITE_ORS_KEY` is set and valid

## Contributing
- Fork, create a feature branch, and open a PR
- Keep changes focused and consistent with existing style
- Avoid adding license headers unless requested

## Acknowledgements
- OpenStreetMap, OpenRouteService, Leaflet
- Google Generative AI (Gemini)

## Documentation
- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [Setup Guide](docs/SETUP.md)
- [User & Driver Guide](docs/USER_GUIDE.md)

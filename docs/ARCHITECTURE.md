# Architecture Overview

REBU RIDE is a full‑stack app with a Node.js/Express backend and a React (Vite) frontend, using MongoDB for persistence and JWT for auth.

## Components
- Backend (Express)
  - Routes: define HTTP endpoints
  - Controllers: business logic per domain
  - Models: Mongoose schemas for `User`, `Driver`, `Ride`
  - Middleware: JWT protection, file uploads (Multer)
  - Config: Database connection, upload config
- Frontend (React)
  - Pages: top‑level views (Home, Ride, Driver)
  - Components: UI building blocks (Navbar, MapView, Toast)
  - Context: `AuthContext` for auth state and role‑based access
  - Services: API clients for backend communication

## Data Flow
1. Frontend calls an API via services (e.g., book a ride)
2. Router matches the request and dispatches to a controller
3. Controller executes logic, uses Mongoose models, and returns JSON
4. Frontend renders data and manages UI state

## Auth Flow
- Login/Register returns a JWT
- Frontend stores the token (context) and sends `Authorization: Bearer <token>`
- `authMiddleware` verifies token → attaches `req.user`
- Protected routes return data/actions only for authenticated users/drivers

## Ride Lifecycle
- searching → requested → accepted → arrived → ongoing → completed → paid
- User initiates `request`; Driver claims/accepts; status progresses via endpoints

## Mapping & Routing
- Geocoding: Nominatim (OpenStreetMap) to resolve text → lat/lon
- Routing: OpenRouteService returns geometry + distance/time
- Rendering: Leaflet map shown via `MapView` component

## AI Assistant
- Backend `aiController` calls Google Generative AI SDK (Gemini)
- `aiRoutes` exposes `/api/ai/ai-chat`, protected by auth
- System prompt configured to be project‑aware

## Error Handling
- Controllers return structured JSON errors
- Frontend displays Toast notifications and inline messages

## Directory Relationships
- Routes → Controllers → Models
- Frontend Pages → Components → Context/Services

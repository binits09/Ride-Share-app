# Setup Guide

## Prerequisites
- Node.js 18+ (recommended 20/22/24)
- MongoDB (local or Atlas)
- OpenRouteService API key
- Optional: Google API key (AI), Razorpay keys (payments)

## Backend Setup
1. Create `backend/.env`:
```
PORT=6200
MONGODB_URI=mongodb://127.0.0.1:27017/rebu_ride
JWT_SECRET=replace-with-strong-secret
CORS_ORIGIN=http://localhost:5173
GOOGLE_API_KEY=your-google-api-key
```
2. Install and run:
```bash
cd backend
npm install
npm run start
# or: node server.js
```

## Frontend Setup
1. Create `frontend/.env`:
```
VITE_API_URL=http://localhost:6200
VITE_ORS_KEY=your-openrouteservice-key
```
2. Install and run:
```bash
cd frontend
npm install
npm run dev
```

## Accounts & Roles
- Register user and driver via UI.
- Admin routes are reserved; navbar hides admin for non-admin roles.

## Keys & Services
- OpenRouteService: used for routing and distance/ETA.
- Nominatim: geocoding for pickup/dropoff suggestions.
- AI (Gemini): via backend controller with `GOOGLE_API_KEY`.

## Common Issues
- CORS: ensure `CORS_ORIGIN` matches the frontend dev URL.
- MongoDB: check URI and service is running.
- ORS: verify `VITE_ORS_KEY` is valid and not rate-limited.

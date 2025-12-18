# API Documentation

All endpoints are prefixed with `/api`. Authenticated routes require `Authorization: Bearer <token>`.

## Auth
- POST `/api/auth/register`
  - Body: `{ name, email, password, role? }`
  - Returns: user + token
- POST `/api/auth/login`
  - Body: `{ email, password }`
  - Returns: user + token

## Rides (User)
- POST `/api/rides/request` (protected)
  - Body: `{ driverId?, pickup: { address, lat, lng }, dropoff: { address, lat, lng }, fare }`
  - Creates a ride; status `searching` or `requested`
- GET `/api/rides/my` (protected)
  - Returns latest ride for the requesting user
- PUT `/api/rides/:id/cancel` (protected)
  - Cancels a ride (if allowed by status)

## Rides (Driver)
- GET `/api/rides/driver` (protected)
  - Returns searching rides (unassigned) and rides assigned to this driver
- POST `/api/rides/claim` (protected)
  - Claims the oldest searching ride; sets driver and status `accepted`
- PUT `/api/rides/:id/accept` (protected)
  - Accept assigned ride
- PUT `/api/rides/:id/reject` (protected)
  - Reject ride; adds driver to `rejectedBy`
- PUT `/api/rides/:id/arrive` (protected)
  - Mark arrived at pickup
- PUT `/api/rides/:id/start` (protected)
  - Start ride
- PUT `/api/rides/:id/complete` (protected)
  - Complete ride
- GET `/api/rides/driver/summary` (protected)
  - Returns `{ totalCompleted, totalEarnings, todaysEarnings }`

## History
- GET `/api/rides/history/user` (protected)
- DELETE `/api/rides/history/user` (protected) — `{ ids: [] }`
- GET `/api/rides/history/driver` (protected)
- DELETE `/api/rides/history/driver` (protected) — `{ ids: [] }`

## Payment
- POST `/api/payments/create-order` (protected)
  - Create payment order (e.g., Razorpay)
- POST `/api/payments/verify` (protected)
  - Verify payment signature

## Driver Profile
- POST `/api/drivers/register` (multipart, `profilePicture`)
- GET `/api/drivers/status` (protected)
- PATCH `/api/drivers/status` (protected)
- PUT `/api/drivers/me` (protected)
- PUT `/api/drivers/email` (protected)
- PUT `/api/drivers/password` (protected)
- PUT `/api/drivers/vehicle` (protected)
- GET `/api/drivers/online-status` (protected)
- PUT `/api/drivers/online-status` (protected)
- GET `/api/drivers/profile` (protected)
- POST `/api/drivers/profile-picture` (protected; multipart)

## User Profile
- PUT `/api/users/me` (protected)
- PUT `/api/users/email` (protected)
- PUT `/api/users/password` (protected)

## AI Assistant
- POST `/api/ai/ai-chat` (protected)
  - Body: `{ message }`
  - Returns: generated assistant reply

## Models
- User: name, email, password, role
- Driver: profile, vehicle, status flags
- Ride: user, driver, pickup, dropoff, fare, status, paymentMethod, timestamps

## Notes
- All protected routes require a valid JWT
- Status transitions are enforced by controllers
- Error messages return `{ message }` with appropriate HTTP codes


# Slottly

A full-stack appointment booking platform built with the MERN stack. Providers manage their services, set weekly availability, and block time off. Customers browse providers, view real-time available slots, and book appointments — with instant conflict prevention.

Built production-grade from scratch: JWT authentication, role-based access control across three user roles, a custom slot-generation algorithm that prevents double-booking, and clean separation between auth, authorization, and ownership checks at every route.

---

## Live Demo

> Coming soon — deploying to Netlify (frontend) + Render (backend)

---

## Features

**Authentication**
- Register and login with hashed passwords (bcryptjs)
- JWT tokens with 7-day expiry
- Protected routes via middleware — token verification on every private endpoint

**Role-Based Access Control**
- Three roles: `customer`, `provider`, `admin`
- `protect` middleware verifies identity; `requireRole` middleware enforces role gates
- Ownership checks inside controllers as a third layer — a provider cannot touch another provider's data even with a valid token

**Provider Capabilities**
- Create, update, and delete services (name, description, duration, price)
- Set weekly availability by day with custom start/end times
- Block specific date ranges with time-off entries

**Customer Capabilities**
- Browse provider services
- Query available slots for any provider + service + date combination
- Book a slot — validated server-side before saving
- Cancel their own appointments

**Slot Generation Algorithm**
- Duration-aware: steps through the provider's working hours in increments matching the service duration (not a fixed 30-min grid)
- Checks weekly schedule for the queried day
- Blocks the entire day if a time-off entry covers that date
- Fetches all non-cancelled appointments and runs overlap detection to skip already-booked slots
- Returns only genuinely bookable `{ startTime, endTime }` pairs

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS *(in progress)* |
| Backend | Node.js + Express 5 |
| Database | MongoDB Atlas + Mongoose 9 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| HTTP logging | morgan |
| Dev tooling | nodemon, Thunder Client |

---

## Project Structure

```
slottly/
└── server/
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── server.js
    └── src/
        ├── models/
        │   ├── User.js
        │   ├── Service.js
        │   ├── Availability.js
        │   ├── TimeOff.js
        │   └── Appointment.js
        ├── controllers/
        │   ├── authController.js
        │   ├── serviceController.js
        │   ├── availabilityController.js
        │   ├── timeOffController.js
        │   └── appointmentController.js
        ├── routes/
        │   ├── authRoutes.js
        │   ├── serviceRoutes.js
        │   ├── availabilityRoutes.js
        │   ├── timeOffRoutes.js
        │   └── appointmentRoutes.js
        ├── middleware/
        │   └── authMiddleware.js
        └── utils/
            └── slotGenerator.js
```

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | None | Register a new user |
| POST | `/login` | None | Login and receive JWT |
| GET | `/me` | Bearer token | Get current user info |

**Register body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "provider"
}
```

---

### Services — `/api/services`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/` | Bearer | provider | Create a service |
| GET | `/my-services` | Bearer | provider | Get own services |
| PUT | `/:id` | Bearer | provider | Update a service (owner only) |
| DELETE | `/:id` | Bearer | provider | Delete a service (owner only) |
| GET | `/:providerId` | Bearer | provider, customer | Get a provider's active services |

---

### Availability — `/api/availability`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| PUT | `/` | Bearer | provider | Set or update weekly schedule (upsert) |
| GET | `/:providerId` | Bearer | provider, customer | Get a provider's availability |

**Set availability body:**
```json
{
  "weeklySchedule": [
    { "day": "Mon", "startTime": "09:00", "endTime": "17:00" },
    { "day": "Tue", "startTime": "09:00", "endTime": "17:00" }
  ]
}
```

---

### Time Off — `/api/timeoff`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/` | Bearer | provider | Add a time-off block |
| GET | `/my-timeoff` | Bearer | provider | Get own time-off entries |
| DELETE | `/:id` | Bearer | provider | Delete a time-off entry (owner only) |

---

### Appointments — `/api/appointments`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/available-slots` | Bearer | any | Query available slots |
| POST | `/` | Bearer | customer | Book an appointment |
| GET | `/my-appointments` | Bearer | any | Get appointments (role-aware) |
| PATCH | `/:id/cancel` | Bearer | any | Cancel an appointment |

**Get available slots (query params):**
```
GET /api/appointments/available-slots?providerId=<id>&serviceId=<id>&date=2026-07-25
```

**Book appointment body:**
```json
{
  "providerId": "<provider_id>",
  "serviceId": "<service_id>",
  "date": "2026-07-25",
  "startTime": "10:00"
}
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)

### Installation

```bash
# Clone the repo
git clone https://github.com/mathewjebis/slottly.git
cd slottly/server

# Install dependencies
npm install

# Create your .env file
touch .env
```

Add to `.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

```bash
# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

---

## Key Design Decisions

**Single User model with a `role` field** — one login system, one token flow, rather than three separate models with duplicated auth logic.

**Availability as a separate document with upsert** — each provider has exactly one Availability document. Calling `PUT /api/availability` always updates it in place rather than creating duplicates.

**TimeOff uses `Date` type (not String)** — enables `$lte` / `$gte` range queries directly in MongoDB, making time-off blocking a single DB query.

**Appointments store `startTime`/`endTime` as `"HH:MM"` strings** — same format as Availability, so the slot algorithm can compare them directly without any date parsing overhead.

**Three-layer security on every write route** — `protect` (is the token valid?) → `requireRole` (does this role have permission?) → ownership check inside the controller (does this user own this resource?). Each layer does exactly one job.

**Slot algorithm steps by service duration, not a fixed interval** — a 45-minute service produces slots at 09:00, 09:45, 10:30 — not 09:00, 09:30, 10:00. This is correct behavior for real booking systems.

---

## Roadmap

- [ ] Input validation layer (express-validator)
- [ ] Rate limiting (express-rate-limit)
- [ ] Admin routes — manage all users
- [ ] React + Tailwind frontend
- [ ] Demo login for recruiters
- [ ] Deploy — Netlify (frontend) + Render (backend)

---

## Author

**S. Mathew Jebis** — [github.com/mathewjebis](https://github.com/mathewjebis)

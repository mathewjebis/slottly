# Slottly

A full-stack appointment booking platform built with the MERN stack. Providers manage their services, set weekly availability, and block time off. Customers browse providers, view real-time available slots, and book appointments — with instant conflict prevention.

Built production-grade from scratch: HTTP-only cookie authentication (XSS-safe), role-based access control across three user roles, a custom slot-generation algorithm that prevents double-booking, email-based password reset, and clean separation between auth, authorization, and ownership checks at every route.

---

## Live Demo

> Coming soon — deploying to Netlify (frontend) + Render (backend)

---

## Features

**Authentication**
- Register and login with hashed passwords (bcryptjs)
- HTTP-only cookie sessions — token never exposed to JavaScript (XSS-safe)
- CSRF protection via sameSite cookie flag
- Email-based password reset — secure random token with 30-minute expiry, cleared after single use

**Role-Based Access Control**
- Three roles: `customer`, `provider`, `admin`
- `protect` middleware verifies identity; `requireRole` middleware enforces role gates
- Ownership checks inside controllers — a provider cannot touch another provider's data even with a valid token

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
- Duration-aware: steps through working hours in increments matching the service duration
- Checks weekly schedule for the queried day
- Blocks the entire day if a time-off entry covers that date
- Overlap detection prevents double-booking
- Returns only genuinely bookable `{ startTime, endTime }` pairs

**Security**
- HTTP-only cookies with secure + sameSite flags
- Rate limiting — 100 requests/15min globally, 20/15min on auth routes
- Input validation on every POST/PUT route (express-validator)
- bcrypt password hashing (salt rounds: 10)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | Node.js + Express 5 |
| Database | MongoDB Atlas + Mongoose 9 |
| Auth | JWT + bcryptjs + HTTP-only cookies |
| Email | Nodemailer + Gmail |
| Dev tooling | nodemon, Thunder Client |

---

## Project Structure

```
slottly/
└── server/
    ├── server.js
    └── src/
        ├── models/          — User, Service, Availability, TimeOff, Appointment
        ├── controllers/     — auth, service, availability, timeOff, appointment
        ├── routes/          — all route files
        ├── middleware/      — authMiddleware, validationMiddleware
        └── utils/           — slotGenerator, sendEmail
```

---

## API Reference

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | None | Register a new user |
| POST | `/login` | None | Login and set HTTP-only cookie |
| POST | `/logout` | None | Clear the auth cookie |
| GET | `/me` | Cookie | Get current user |
| POST | `/forgot-password` | None | Send reset email |
| POST | `/reset-password/:token` | None | Reset password |

### Services — `/api/services`
| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/` | provider | Create a service |
| GET | `/my-services` | provider | Get own services |
| PUT | `/:id` | provider | Update a service |
| DELETE | `/:id` | provider | Delete a service |
| GET | `/:providerId` | any | Get provider's services |

### Availability — `/api/availability`
| Method | Endpoint | Role | Description |
|---|---|---|---|
| PUT | `/` | provider | Set weekly schedule |
| GET | `/:providerId` | any | Get availability |

### Time Off — `/api/timeoff`
| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/` | provider | Add time off |
| GET | `/my-timeoff` | provider | Get own time off |
| DELETE | `/:id` | provider | Delete time off |

### Appointments — `/api/appointments`
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/available-slots` | any | Query available slots |
| POST | `/` | customer | Book an appointment |
| GET | `/my-appointments` | any | Get appointments |
| PATCH | `/:id/cancel` | any | Cancel appointment |

---

## Getting Started

```bash
git clone https://github.com/mathewjebis/slottly.git
cd slottly/server
npm install
```

Create `.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

---

## Key Design Decisions

**HTTP-only cookies over localStorage** — tokens stored in localStorage are vulnerable to XSS attacks. HTTP-only cookies are inaccessible to JavaScript entirely.

**Single User model with role field** — one login system, one token flow, rather than three separate models.

**Availability as a separate document with upsert** — each provider has exactly one Availability document, updated in place.

**Three-layer security** — `protect` (token valid?) → `requireRole` (role permitted?) → ownership check (user owns this resource?). Each layer does exactly one job.

**Slot algorithm steps by service duration** — a 45-minute service produces slots at 09:00, 09:45, 10:30 — not a fixed 30-minute grid.

---

## Roadmap

- [ ] React + Tailwind frontend
- [ ] Admin panel
- [ ] Demo login for recruiters
- [ ] Deploy — Netlify + Render

---

## Author

**S. Mathew Jebis** — [github.com/mathewjebis](https://github.com/mathewjebis)

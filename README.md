# Slottly — Smart Appointment Scheduling Engine & Booking Platform

[![Status](https://img.shields.io/badge/status-production--ready-success.svg)](https://github.com/mathewjebis/slottly)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

Slottly is a modern, production-grade appointment booking platform built with the MERN stack. Designed for service providers (salons, clinics, consultants, personal trainers) to manage their weekly availability, time off, and services while offering customers a seamless, real-time booking experience without double-bookings.

---

## 🌟 Key Features & Capabilities

### 🔐 Security & Authentication
- **HTTP-Only Cookie Auth**: JWT tokens are transmitted exclusively via HTTP-only, secure, `sameSite` cookies to prevent XSS vulnerabilities.
- **Role-Based Access Control (RBAC)**: Strict separation between `customer` and `provider` access.
- **Resource Ownership Validation**: Multi-layer authorization ensures providers can only view, modify, or delete their own services, schedule, time off, and appointments.
- **Account Verification & Recovery**: Email verification flow and secure 30-minute token password resets via Brevo transactional email API.
- **Rate-Limiting & Input Sanitation**: Guarded against brute-force attacks via `express-rate-limit` and validated inputs via `express-validator`.

### 🗓️ Smart Slot Calculation Engine
- **Duration-Aware Step Algorithm**: Dynamically calculates available booking slots based on service duration (e.g. 15, 30, 45, 60 mins).
- **Multi-Factor Conflict Filtering**:
  - Filters out days and times outside provider's active weekly schedule.
  - Automatically excludes dates blocked in time off / vacation logs.
  - Detects overlapping non-cancelled appointments to eliminate double-booking risks.
  - Filters past times/days based on current timestamp.

### 💼 Provider Features
- **Service Management**: Full CRUD for services with custom name, duration (minutes), and pricing.
- **Weekly Schedule Configuration**: Set custom working hours (`startTime` to `endTime`) per day of the week.
- **Time Off Management**: Block single or multi-day time off ranges with custom notes.
- **Appointment Lifecycle**: View, confirm, complete, or cancel incoming customer appointments.

### 👤 Customer Features
- **Provider & Service Discovery**: Search providers by name or service offering.
- **Interactive Booking Flow**: Select provider, service, target date, and an available calculated slot with instant cost and duration summary.
- **Appointment Management**: Track active, completed, and cancelled appointments with live status badges.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Routing**: React Router v8
- **Styling**: Tailwind CSS v4 + Custom Design Tokens
- **HTTP Client**: Axios (configured with `withCredentials: true`)

### Backend
- **Runtime**: Node.js & Express 5
- **Database**: MongoDB & Mongoose ORM
- **Security & Utilities**: `jsonwebtoken`, `bcryptjs`, `cookie-parser`, `express-validator`, `express-rate-limit`, `cors`
- **Email Delivery**: Brevo Transactional Email REST API

---

## 📂 Codebase Architecture

```
slottly/
├── client/                      # React Frontend (Vite)
│   ├── public/                  # Static assets & _redirects
│   ├── src/
│   │   ├── api/                 # Axios instance with credentials
│   │   ├── components/          # Reusable UI (Navbar, Logo, AuthLayout, DashboardLayout)
│   │   ├── context/             # AuthContext state & session management
│   │   ├── lib/                 # Formatting utilities & helpers
│   │   ├── pages/               # Landing, Login, Register, VerifyEmail, ForgotPassword,
│   │   │                        # ResetPassword, Dashboard, Providers, Book,
│   │   │                        # Appointments, AppointmentConfirm, Settings
│   │   ├── App.jsx              # Protected routes & role-based routing
│   │   └── main.jsx             # Entry point
│   └── vite.config.js
│
└── server/                      # Express Backend REST API
    ├── server.js                # App initialization & middleware
    └── src/
        ├── controllers/         # Auth, Service, Availability, TimeOff, Appointment, Provider
        ├── middleware/          # JWT protect, requireRole, express-validator schemas
        ├── models/              # User, Service, Availability, TimeOff, Appointment schemas
        ├── routes/              # Express endpoint routers
        └── utils/               # slotGenerator, sendEmail, dateHelpers, timeHelpers
```

---

## 🚀 Quick Start & Installation

### Setup Instructions

1. **Clone Repository**
   ```bash
   git clone https://github.com/mathewjebis/slottly.git
   cd slottly
   ```

2. **Backend Configuration**
   ```bash
   cd server
   npm install
   ```
   Create `.env` in `server/`:
   ```env
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/slottly
   CLIENT_URL=http://localhost:5173
   GMAIL_USER=your_sender_email@example.com
   BREVO_API_KEY=your_brevo_api_key
   NODE_ENV=development
   ```
   Run backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Configuration**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
   Access at `http://localhost:5173`.

---

## 🧪 Testing & Verification

- **Frontend Linting**: Run `npm run lint` in `/client` (0 warnings, 0 errors).
- **Frontend Build**: Run `npm run build` in `/client` (generates static `/dist`).
- **Backend Node Verification**: Run `node -c server.js` inside `/server`.

---

## 📄 License

This project is licensed under the ISC License.

# Slottly

A full-stack appointment booking platform built with the MERN stack — designed for service providers (salons, clinics, consultants, etc.) to manage their availability and services, with secure role-based access for Customers and Providers.

🔗 **[Live Demo](https://slottly.netlify.app)** | 🔧 [Backend Source](https://github.com/mathewjebis/slottly)

## Tech Stack

**Frontend:** React 19 (Vite), Tailwind CSS v4, React Router v8, Axios
**Backend:** Node.js, Express 5, MongoDB, Mongoose
**Auth & Security:** JWT via HTTP-only cookies, bcrypt, express-validator, express-rate-limit
**Email:** Brevo (transactional email API)
**Deployment:** Netlify (frontend) + Render (backend) + MongoDB Atlas

## Features

### Authentication & Security
- Register / Login / Logout with role selection (Customer / Provider)
- HTTP-only cookie-based JWT auth — no token in localStorage, XSS-safe
- Forgot/reset password via email — secure random token with 30-minute expiry
- Role-based route protection plus ownership checks on every resource (a Provider can only edit their own data)
- Rate limiting and input validation (express-validator) on every POST/PUT route
- Passwords hashed with bcrypt
- Cross-domain auth configured for production — environment-aware cookie `sameSite`/`secure` flags, CORS locked to the deployed frontend origin

### Provider Dashboard
- Full CRUD for services — name, description, duration, price
- Weekly availability manager — toggle any day on/off, set a start/end time per day
- Time off manager — block out date ranges with an optional reason
- Fully responsive, tested down to 320px screen width

### Booking Engine (backend)
- Custom slot-generation algorithm — computes real bookable time slots from a provider's weekly availability, time-off periods, and existing bookings
- Duration-aware stepping with overlap detection to prevent double-booking
- Full appointment CRUD (create, cancel, list) with role-based access

## In Progress
- Customer-facing booking flow (browse providers, view slots, book)
- My Appointments page
- Admin panel
- Landing page

## Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account
- Brevo account (for password reset emails)

### Installation

git clone https://github.com/mathewjebis/slottly.git
cd slottly

Backend
cd server
npm install
cp .env.example .env   # fill in your own values
npm run dev

Frontend (in a new terminal)
cd ../client
npm install
npm run dev

### Environment Variables

**server/.env**

PORT=5000
JWT_SECRET=your_jwt_secret_key_here
MONGO_URI=your_mongodb_connection_string
GMAIL_USER=your_sender_email@gmail.com
BREVO_API_KEY=your_brevo_api_key
CLIENT_URL=http://localhost:5173

**client/.env**

VITE_API_URL=http://localhost:5000/api

## Project Structure

slottly/
├── client/          # React frontend (Vite + Tailwind)
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── api/
└── server/          # Express backend
    └── src/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── routes/
        └── utils/

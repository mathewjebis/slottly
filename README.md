# Slottly — Backend API

Robust backend RESTful API for an appointment booking platform built using Node.js, Express, and MongoDB. This service handles user roles, secure token-based authentication, and appointment scheduling constraints.

## 🚀 Features
- **Secure Authentication:** User signup and login protected by JWT tokens.
- **Role-Based Access Control:** Distinct workflows for clients/users and admin/service providers.
- **Appointment Management:** Secure endpoints to book, view, and cancel slots seamlessly.
- **Database Integration:** Flexible data modeling with MongoDB and validation via Mongoose schemas.

## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose ORM
- **Security:** JSON Web Tokens (JWT) & bcryptjs for password hashing

## 📂 Project Structure
```text
server/
├── config/         # Database connection configuration
├── controllers/    # Request handlers and business logic
├── middleware/     # Auth checks and route protection
├── models/         # Mongoose schemas (User, Booking, Slot)
├── routes/         # Express API route declarations
└── server.js       # Core application entry point
```

## 🔌 API Endpoints (Quick Overview)

### Authentication
- `POST /api/auth/register` — Register a new user account
- `POST /api/auth/login` — Authenticate user and receive a JWT token

### Bookings & Slots
- `GET /api/bookings` — Fetch all scheduled appointments for the authenticated user
- `POST /api/bookings` — Book an available appointment slot
- `DELETE /api/bookings/:id` — Cancel an existing booking slot

---

## 💻 Getting Started Locally

1. Clone the repository:
   ```bash
   git clone https://github.com
   cd slottly/server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:  
   Create a `.env` file inside the `server/` directory and include your configuration:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret_key
   ```
4. Fire up the development environment:
   ```bash
   npm run dev
   ```

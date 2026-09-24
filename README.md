# Lucky-Events &bull; Modern Full-Stack Event Management & RSVP Platform

A modern, full-stack SaaS event management and RSVP web application built with **ReactJS (Vite)**, **Styled-Components**, **ExpressJS**, and **MongoDB (Mongoose)**.

Designed with rich aesthetics, glassmorphic dark theme, responsive navigation, digital ticket pass generation, automated background email reminders, and robust role-based access control.

---

## 🌟 Key Highlights & Features

### 🖥️ Frontend (ReactJS + Styled-Components + Vite)
- **Responsive SaaS Landing Page:**
  - **Hero Section:** High-converting gradient headlines, floating stats cards, and dual call-to-actions.
  - **Curated Live Summits Showcase:** Real-time event cards directly from the database.
  - **Feature Bento Grid:** Highlights 1-click RSVP, automated reminders, dynamic capacity, and security.
  - **SaaS Pricing Cards:** Monthly and Annual billing toggle with 20% discount badge.
  - **Customer Testimonials & Star Ratings:** Authentic organizer and attendee reviews.
  - **Interactive FAQ Accordion:** Expandable answers for common questions.
- **Events Explorer & Discovery:**
  - Real-time search across event titles, descriptions, and locations.
  - Category pill filter tabs (*Technology, Business, Design, Marketing, Networking, Health & Wellness*).
  - Ticket type filtering (*All, Free, Paid*) and multiple sort orders (*Date, Popularity, Newest, Price*).
  - Numbered pagination.
- **Event Details & Interactive RSVP:**
  - Cover banner with category and price badges.
  - Live capacity progress bar and remaining seat counter.
  - **1-Click RSVP Booking Widget** with guest count selector (1–5 guests) and organizer notes.
  - **Confetti Celebration & Instant Digital Ticket Pass** modal with unique ticket barcode/code.
  - Safe RSVP cancellation modal releasing seats back to capacity.
  - Organizer controls (*Edit Event, Delete Event, Broadcast Reminders, View Attendee Roster*).
  - Virtual meeting link reveals securely to confirmed attendees.
- **Creator Dashboard:**
  - KPI overview metrics (*Events Hosted, Total Attendees Registered, Active Reservations*).
  - "Events I'm Organizing" management table with direct view, edit, delete, and reminder actions.
  - "My RSVPs & Ticket Passes" cards with ticket codes, date, location, and quick cancellation.
- **Event Creation & Editing:**
  - Rich form with presets cover gallery, category picker, datetime-local pickers, venue vs virtual toggles, capacity limits, and pricing.
- **Profile & Security Settings:**
  - Profile details editor (name, organization, bio, custom avatar URL).
  - Password change with bcrypt security.
- **Authentication Pages:**
  - Split-screen design for Sign In and Sign Up.
  - **1-Click Demo Login Buttons** (*Admin Eleanor, Organizer Sarah, Attendee Alex*) for instant testing.

---

### ⚙️ Backend (ExpressJS + MongoDB + Nodemailer + Cron)
- **RESTful API Architecture:**
  - Clean MVC controller structure (`controllers/`, `routes/`, `models/`, `middleware/`, `services/`).
- **User Authentication & Role-Based Access Control (RBAC):**
  - Secure password hashing using `bcryptjs` (salt rounds: 10).
  - Stateless JSON Web Tokens (`jsonwebtoken`) with 30-day expiry.
  - Roles: `user` and `admin`. Event ownership verification for updates and deletions.
- **Data Persistence (MongoDB & Mongoose):**
  - **User Model:** Name, email, hashed password, role, avatar, bio, organization.
  - **Event Model:** Title, description, category, dates, time, virtual/in-person, location, capacity, ticket type, price, banner, tags, and virtual getters (`availableSeats`, `isSoldOut`).
  - **RSVP Model:** Event ID, User ID, guest count, ticket code (`TKT-XXXXXX`), status (`attending`, `waitlist`, `cancelled`), unique compound index preventing duplicate active registrations.
- **Automated & Manual Email Notifications:**
  - `Nodemailer` integration with responsive HTML email templates:
    1. **RSVP Confirmation:** Branded email with digital ticket pass, event details, and add-to-calendar link.
    2. **Event Reminders:** Dispatched automatically **24 hours prior** to event start via background cron scheduler (`node-cron`).
    3. **RSVP Cancellation:** Notification confirming seat release.
    4. **Manual Reminder Broadcast:** Organizers can trigger instant attendee notification broadcasts from the UI.
  - Automatic Ethereal fallback: generates instant preview URLs in console if custom SMTP credentials are not configured.
- **Centralized Error Handling & Input Validation:**
  - `express-validator` middleware for route-level schema validation.
  - Centralized global error handler capturing Mongoose duplicate keys, validation errors, and invalid ObjectIDs.
- **Pagination & Query Optimization:**
  - Server-side text search and indexing for high-performance filtering.

---

## 🗂️ Project Directory Structure

```text
luckyevents/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register, Login, Me
│   │   │   ├── eventController.js    # Event CRUD, Search, Pagination
│   │   │   ├── rsvpController.js     # RSVP, Waitlist, Attendees Roster
│   │   │   └── userController.js     # Profile, Password, Stats
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT & RBAC verification
│   │   │   ├── errorMiddleware.js    # Global error handler & 404
│   │   │   └── validateMiddleware.js # express-validator results
│   │   ├── models/
│   │   │   ├── User.js               # User schema & bcrypt hook
│   │   │   ├── Event.js              # Event schema, indexes & virtuals
│   │   │   └── RSVP.js               # RSVP schema & unique compound index
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── eventRoutes.js
│   │   │   ├── rsvpRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── services/
│   │   │   ├── emailService.js       # Nodemailer HTML email templates
│   │   │   └── reminderScheduler.js  # Node-cron background reminder job
│   │   ├── utils/
│   │   │   └── seedData.js           # Database seeder with realistic summits
│   │   └── server.js                 # Express app bootstrap
│   ├── .env                          # Backend environment variables
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js             # Fetch wrapper with auto-auth headers
│   │   ├── components/
│   │   │   ├── EventCard.jsx         # Card with progress bar & tags
│   │   │   ├── Footer.jsx            # SaaS footer with newsletter form
│   │   │   ├── LoadingSpinner.jsx    # Animated spinner
│   │   │   ├── Modal.jsx             # Accessible backdrop dialog
│   │   │   ├── Navbar.jsx            # Sticky blurred glass navbar
│   │   │   ├── Pagination.jsx        # Numbered pagination controls
│   │   │   ├── ProtectedRoute.jsx    # Auth route guard
│   │   │   ├── StatCard.jsx          # Dashboard KPI metric box
│   │   │   └── Toast.jsx             # Floating notification toast
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global auth state & toast provider
│   │   ├── pages/
│   │   │   ├── CreateEventPage.jsx   # Event publishing form
│   │   │   ├── DashboardPage.jsx     # Creator dashboard & ticket passes
│   │   │   ├── EditEventPage.jsx     # Event editing form
│   │   │   ├── EventDetailPage.jsx   # Full event view with RSVP widget
│   │   │   ├── EventsExplorerPage.jsx# Search & category explorer
│   │   │   ├── LandingPage.jsx       # SaaS landing page
│   │   │   ├── LoginPage.jsx         # Sign in with 1-click demo buttons
│   │   │   ├── ProfilePage.jsx       # User profile & password settings
│   │   │   └── SignupPage.jsx        # User registration form
│   │   ├── styles/
│   │   │   ├── GlobalStyles.js       # Reset, background gradient meshes
│   │   │   └── theme.js              # Tokens, colors, radii, shadows
│   │   ├── App.jsx                   # Routes and providers assembly
│   │   └── main.jsx
│   ├── index.html                    # SEO tags & Google Fonts (Outfit & Plus Jakarta Sans)
│   ├── vite.config.js                # Vite config with backend proxy (/api -> :5000)
│   └── package.json
├── package.json                      # Root scripts (dev, seed, install:all)
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js** (v18 or v20+ recommended)
- **MongoDB** running locally on default port `27017` (or MongoDB Atlas connection URI)

### 2. Installation
Install all dependencies in one command from the project root:
```bash
npm run install:all
```
*(Or navigate into `backend/` and `frontend/` separately and run `npm install` in each).*

### 3. Environment Configuration
Check `backend/.env` (pre-configured with sensible development defaults):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/luckyevents
JWT_SECRET=super_secret_luckyevents_jwt_key_2026_modern_saas
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173

# Optional Custom SMTP settings (Ethereal test accounts used automatically if blank)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM="LuckyEvents" <noreply@luckyevents.com>
```

### 4. Seed Database with Realistic Data
Populate demo accounts and high-quality summits, conferences, and RSVPs:
```bash
npm run seed
```

### 5. Start the Application
Start both the backend server and frontend client simultaneously with:
```bash
npm run dev
```

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)
- **Backend API Server:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo User Credentials

The database comes pre-seeded with 3 accounts. You can also click the **1-Click Demo Buttons** on the Login page:

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Admin** | Eleanor Vance | `admin@luckyevents.com` | `password123` |
| **Organizer** | Sarah Jenkins | `sarah@luckyevents.com` | `password123` |
| **Attendee** | Alex Rivera | `alex@luckyevents.com` | `password123` |

---

## 📚 API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` &ndash; Create a new user account.
- `POST /api/auth/login` &ndash; Authenticate user & return JWT token.
- `GET /api/auth/me` &ndash; Get current logged-in user profile (*Private*).

### Events (`/api/events`)
- `GET /api/events` &ndash; Paginated list with search keyword, category, ticketType, sort.
- `GET /api/events/featured` &ndash; Top featured events for the landing page.
- `GET /api/events/user/my-events` &ndash; Events organized by the current user (*Private*).
- `GET /api/events/:id` &ndash; Full event details, organizer info, recent attendees.
- `POST /api/events` &ndash; Create an event (*Private*).
- `PUT /api/events/:id` &ndash; Update an event (*Private, Organizer or Admin*).
- `DELETE /api/events/:id` &ndash; Delete an event and cleanup RSVPs (*Private, Organizer or Admin*).
- `POST /api/events/:id/send-reminders` &ndash; Trigger instant email reminder broadcast (*Private*).

### RSVPs (`/api/events/:id/rsvp` & `/api/rsvps`)
- `POST /api/events/:id/rsvp` &ndash; Submit RSVP with guest count; checks capacity limits (*Private*).
- `DELETE /api/events/:id/rsvp` &ndash; Cancel RSVP and release seats (*Private*).
- `GET /api/events/:id/rsvps` &ndash; Attendee roster for organizer (*Private*).
- `GET /api/events/:id/rsvp/status` &ndash; Current user's ticket status for this event (*Private*).
- `GET /api/rsvps/my-rsvps` &ndash; All active reservations for logged-in user (*Private*).

### User Management (`/api/users`)
- `PUT /api/users/profile` &ndash; Update full name, bio, organization, avatar (*Private*).
- `PUT /api/users/password` &ndash; Change password (*Private*).
- `GET /api/users/stats` &ndash; Aggregate counts for hosted events, total attendees, and RSVPs (*Private*).

---

## 🧪 Testing the Production Build
To verify the production bundle:
```bash
npm run build
```
Builds the optimized production assets into `frontend/dist/`.

---

## 📄 License
ISC License &bull; Designed and built for LuckyEvents.

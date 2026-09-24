# LuckyEvents &bull; Event Management Booking Platform (MERN)

A production-ready full-stack Event Management Booking Platform built with the **MERN stack** (MongoDB, Express, React, Node.js) and Tailwind CSS.

LuckyEvents supplies professional staff and on-site event managers to plan and run **Birthday Parties**, **Weddings & Receptions**, **Corporate & Professional Summits**, and **Family Functions**. Customers book online with real-time transparent price estimates, while an authoritative server-side pricing engine recomputes and freezes all calculations.

---

## 🎯 Architecture & Hard Constraints (Non-Negotiable)

1. **Server-Side Price Authority:**
   - Every booking write recomputes and validates the price on the server (`computeBookingPrice`). Client-sent totals are strictly ignored.
2. **Frozen Snapshot on Creation:**
   - The full price breakdown (`categoryTotal`, `addOnsBreakdown`, `addOnsTotal`, `grandTotal`) is frozen into the `Booking` document at creation time. Subsequent price changes by Admin do not alter historical bookings.
3. **Database-Driven Catalog:**
   - Categories and Add-on Services live entirely in MongoDB and are dynamically managed via the Admin Dashboard. No categories or services are hardcoded in frontend components.
4. **Role-Based Access Control (RBAC):**
   - Every write route and private view sits behind `authMiddleware` and `roleMiddleware` (`admin`, `staff`, `customer`).
   - Passwords are encrypted with `bcryptjs`.
   - Secrets are managed via `.env`.

---

## 📐 Pricing Engine Formula & Worked Example

$$\text{categoryTotal} = \text{category.basePricePerAttendee} \times \text{attendeeCount}$$

$$\text{addOnsTotal} = \sum \text{addon.price (flat)} + \sum \left(\text{addon.price} \times \text{attendeeCount}\right) \text{ (perAttendee)}$$

$$\text{grandTotal} = \text{categoryTotal} + \text{addOnsTotal}$$

### ✅ Worked Example (Self-Checked & Verified)
- **Category:** Wedding/Marriage (`₹1,500` / attendee)
- **Attendees:** `100` attendees
- **Add-on 1:** Catering (`perAttendee`, `₹300` / attendee)
- **Add-on 2:** DJ & Music (`flat`, `₹8,000`)
- **Calculations:**
  - $\text{categoryTotal} = 1500 \times 100 = ₹150,000$
  - $\text{addOnsTotal} = (300 \times 100) + 8000 = 30,000 + 8,000 = ₹38,000$
  - $\mathbf{grandTotal} = 150,000 + 38,000 = \mathbf{₹188,000}$

---

## 👥 User Roles & Permissions

| Role | Permissions & Capabilities |
| :--- | :--- |
| **Admin** | Full CRUD on Categories, Add-on Services, and Staff Accounts. Review, confirm, or reject all bookings. Assign staff members to bookings. Access aggregate analytics & revenue stats. |
| **Staff / Manager** | Sees **only** bookings assigned to their account. Views on-site event details, venue address, notes, and client contact. Updates assignment status (`assigned`, `confirmed`, `completed`). |
| **Customer** | Browses event categories & services. Books via 4-step wizard with real-time price preview. Tracks personal bookings. Cancels bookings while status is `pending` or `confirmed`. |

---

## 📁 Project Folder Structure

```
luckyevents/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection & reconnect logic
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register, login, getMe
│   │   │   ├── categoryController.js # CRUD for event categories
│   │   │   ├── serviceController.js  # CRUD for add-on services
│   │   │   ├── staffController.js    # Staff accounts management
│   │   │   └── bookingController.js  # Server-priced bookings & assignment
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT verification & role-based guard
│   │   │   └── errorMiddleware.js    # Centralized error handler
│   │   ├── models/
│   │   │   ├── User.js               # Admin, Staff, Customer schema
│   │   │   ├── Category.js           # Category schema (rate/attendee)
│   │   │   ├── Service.js            # Add-on schema (flat / perAttendee)
│   │   │   └── Booking.js            # Booking schema with frozen priceBreakdown
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── serviceRoutes.js
│   │   │   ├── staffRoutes.js
│   │   │   └── bookingRoutes.js
│   │   ├── utils/
│   │   │   ├── pricingEngine.js      # Authoritative pricing calculation engine
│   │   │   ├── seedData.js           # Seed script (categories, services, users)
│   │   │   ├── comprehensiveTest.js  # End-to-end automated verification suite
│   │   │   └── testCustomerCancel.js # Customer cancellation test suite
│   │   └── server.js                 # Express server bootstrap
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js              # Axios instance with auth interceptors
    │   ├── components/
    │   │   ├── Navbar.jsx            # Dynamic role-aware navigation
    │   │   ├── Footer.jsx            # Platform footer with service links
    │   │   ├── Toast.jsx             # Notification toasts
    │   │   ├── LoadingSpinner.jsx    # Custom animated loading indicator
    │   │   └── RoleProtectedRoute.jsx # Route barrier by role
    │   ├── context/
    │   │   └── AuthContext.jsx       # Global auth state & token management
    │   ├── pages/
    │   │   ├── HomePage.jsx          # Public landing page with pricing calculator
    │   │   ├── CategoriesPage.jsx    # Live categories from DB
    │   │   ├── CategoryDetailPage.jsx # Individual category & headcount calculator
    │   │   ├── ServicesPage.jsx      # Add-on services catalog
    │   │   ├── BookingWizardPage.jsx # 4-Step Booking Wizard with live preview
    │   │   ├── LoginPage.jsx         # 1-Click demo logins for all 3 roles
    │   │   ├── RegisterPage.jsx      # Customer registration
    │   │   ├── CustomerDashboardPage.jsx # Customer booking history & cancellation
    │   │   ├── StaffDashboardPage.jsx # Assigned event manager cockpit
    │   │   └── AdminDashboardPage.jsx # Admin Command Center (CRUD + Assign + Stats)
    │   ├── App.jsx                   # React Router assembly
    │   ├── main.jsx                  # React DOM root
    │   └── index.css                 # Tailwind CSS styles
    ├── vite.config.js
    └── package.json
```

---

## 🔑 Pre-Seeded Test Credentials

| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@luckyevents.com` | `admin123` | `/admin` |
| **Staff / Manager** | `staff@luckyevents.com` | `staff123` | `/staff-dashboard` |
| **Customer** | `customer@luckyevents.com` | `customer123` | `/my-bookings` |

*Note: The Login page includes 1-Click buttons to instantly populate any of these test credentials.*

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas URI)

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env` (or copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/luckyevents?retryWrites=true&w=majority
JWT_SECRET=luckyevents_production_jwt_super_secret_key_2026_xyz
CLIENT_URL=http://localhost:5173
```

### 3. Run Seed Script
Populates the 4 event categories, 6 add-on services, and test users:
```bash
cd backend
npm run seed
```

### 4. Run Automated Test Suites
Verify the pricing engine against the worked example and confirm RBAC security:
```bash
cd backend
node src/utils/comprehensiveTest.js
node src/utils/testCustomerCancel.js
```

### 5. Frontend Setup
```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Application Locally

### Start Backend Dev Server (Port 5000)
```bash
cd backend
npm run dev
```

### Start Frontend Dev Server (Port 5173)
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 REST API Reference

### Auth
- `POST /api/auth/register` — Register new customer account (`name`, `email`, `password`, `phone`)
- `POST /api/auth/login` — Login user & return JWT token
- `GET /api/auth/me` — Return current authenticated profile *(Auth required)*

### Catalog (Categories & Services)
- `GET /api/categories` — List active categories *(Public)*
- `POST /api/categories` — Create category *(Admin only)*
- `PUT /api/categories/:id` — Update category *(Admin only)*
- `DELETE /api/categories/:id` — Delete category *(Admin only)*
- `GET /api/services` — List active add-on services *(Public)*
- `POST /api/services` — Create add-on service *(Admin only)*
- `PUT /api/services/:id` — Update add-on service *(Admin only)*
- `DELETE /api/services/:id` — Delete add-on service *(Admin only)*

### Bookings
- `POST /api/bookings` — Create new booking with server-side price computation *(Customer)*
- `GET /api/bookings/my` — Get logged-in customer's bookings *(Customer)*
- `GET /api/bookings` — Get all bookings with status filter *(Admin only)*
- `GET /api/bookings/assigned` — Get bookings assigned to logged-in staff member *(Staff only)*
- `PATCH /api/bookings/:id/status` — Update booking status (`pending`, `confirmed`, `assigned`, `completed`, `cancelled`)
- `PATCH /api/bookings/:id/assign` — Assign staff member(s) to a booking *(Admin only)*
- `DELETE /api/bookings/:id` — Remove booking *(Admin only)*
- `GET /api/bookings/stats` — Aggregate metrics and total revenue *(Admin only)*

### Staff
- `GET /api/staff` — List staff accounts *(Admin only)*
- `POST /api/staff` — Create staff account *(Admin only)*

---

## ✅ Definition of Done Verification Checklist

- [x] **Seed script** populates 1 admin, 1 staff, 1 customer, 4 categories, and 6 add-on services.
- [x] **Customer booking & live preview** matches pricing formula:
  $$\text{Category Total} + \text{Add-ons Total} = \text{Grand Total}$$
- [x] **Server-side authority:** Booking price stored on MongoDB matches server computation independent of frontend values.
- [x] **Frozen price breakdown:** Category and add-on unit prices at creation time are preserved permanently in `priceBreakdown`.
- [x] **Admin workflows:** Admin can confirm bookings, assign staff members, manage categories/services, and view stats.
- [x] **Staff dashboard:** Staff members see only events assigned to them and can update operational status.
- [x] **RBAC security barrier:** Gated with `authMiddleware` + `roleMiddleware` on routes and protected views.

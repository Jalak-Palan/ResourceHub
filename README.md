# ResourceHub – Equipment & Resource Booking Management System

> **Book • Manage • Track – All Your Resources in One Place.**

ResourceHub is a modern, responsive equipment and resource reservation web platform built for colleges, research laboratories, and academic departments. It features a complete student self-service booking portal alongside an administrative inventory and approval management system.

The visual design closely follows the warm cream and peach-toned aesthetic (`#FFF7F1` background, `#E77B52` primary peach, `#29201D` dark slate typography), inspired by modern mobile UI standards.

---

## 📱 The 15 Full Application Screens

### 🎓 Student Section
1. **Welcome / Landing Page (`/welcome`)**: Hero illustration, project description, gear showcase, and role selection.
2. **Login Page (`/login`)**: Email/password authentication, social Google login, OTP alternative, and "Remember Me".
3. **Signup Page (`/signup`)**: Registration form with role selection (Student, Staff, Admin).
4. **Student Dashboard (`/dashboard`)**: Greeting header, "Smart Booking Made Easy" promo banner, 6 category quick-links, and available equipment cards.
5. **Browse Resources (`/resources`)**: Search bar, category filter pills, stock counts, and instant reservation cards.
6. **Resource Details (`/resources/[id]`)**: High-resolution image showcase, ratings & reviews, specifications checklist, live availability badge, and location.
7. **Booking Form (`/book/[id]`)**: Date picker, time slot picker, academic purpose selector, and real-time inventory validation.
8. **Booking Success Page (`/booking-success`)**: Confetti animation, confirmation badge, generated booking ID (e.g. `#RH20261122001`), and quick navigation.
9. **My Bookings (`/bookings`)**: Categorized tabs (`All`, `Pending`, `Approved`, `Rejected`), status badges, and booking cards.
10. **Profile Page (`/profile`)**: User avatar, department details, student ID, quick navigation to bookings, notifications, help & support, and sign out.

### 🛡️ Admin Section
11. **Admin Dashboard (`/admin`)**: Metric cards (120 Users, 35 Resources, 245 Bookings), booking trends SVG area chart, and recent requests.
12. **Manage Resources (`/admin/resources`)**: Active/inactive toggle switches, add equipment modal, edit & delete controls.
13. **Booking Approval (`/admin/bookings`)**: Pending, Approved, and Rejected request filters with one-click **Approve** and **Reject** actions.
14. **Issue & Return History (`/admin/history`)**: Equipment check-out records, return tracking, overdue alerts, and instant **Check In / Mark as Returned** action.
15. **Notifications (`/notifications`)**: Real-time alerts for booking approvals, rejections, maintenance reminders, and new equipment arrivals.

### 🖼️ 15-Screen Showcase Deck (`/deck`)
- View all 15 screens simultaneously in an interactive device frame grid matching the design reference layout.
- Filter between All, Student Section, or Admin Management screens.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with `pg` (node-postgres connection pooling, transactions, schema auto-migration & seeding)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom palette and soft shadows
- **Icons**: [Lucide React](https://lucide.dev/)
- **Micro-interactions**: Canvas Confetti for celebrations, SVG smooth spline charts for analytics.

---

## 🐘 PostgreSQL Configuration

Database configuration in `.env.local`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=admin123
DB_NAME=resourcehub
DATABASE_URL=postgresql://postgres:admin123@localhost:5432/resourcehub
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### PostgreSQL Database Schema:
- **`users`**: `id`, `name`, `email`, `password_hash`, `role`, `profile_image`, `department`, `student_id`, `phone`, timestamps.
- **`resources`**: `id`, `name`, `description`, `category`, `image`, `specifications` (JSONB), `total_quantity`, `available_quantity`, `location`, `rating`, `reviews_count`, `is_active`, timestamps.
- **`bookings`**: `id`, `booking_id`, `user_id`, `user_name`, `user_email`, `user_role`, `resource_id`, `resource_name`, `resource_image`, `resource_category`, `booking_date`, `start_time`, `end_time`, `purpose`, `status`, `issue_date`, `expected_return_date`, `actual_return_date`, `is_overdue`, timestamps.
- **`notifications`**: `id`, `user_id`, `title`, `message`, `type`, `is_read`, `booking_id`, `created_at`, `timestamp`.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize & Seed PostgreSQL Database
```bash
npm run db:init
```
*(The database tables and initial sample records also auto-initialize automatically on first application startup).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Architecture

```
ResourceHub/
├── app/
│   ├── api/
│   │   ├── bookings/        # GET, POST, PATCH booking records in PostgreSQL
│   │   ├── init-db/         # GET database status & table counts
│   │   ├── notifications/   # GET, PATCH alerts in PostgreSQL
│   │   ├── resources/       # GET, POST, PUT, DELETE equipment in PostgreSQL
│   │   ├── stats/           # GET live computed metrics from PostgreSQL
│   │   └── users/           # GET, POST users in PostgreSQL
│   ├── admin/
│   │   ├── bookings/        # Booking approval screen
│   │   ├── history/         # Issue & return history screen
│   │   ├── resources/       # Manage equipment inventory
│   │   └── page.tsx         # Admin dashboard
│   ├── book/[id]/           # Booking form screen
│   ├── booking-success/     # Success confirmation screen
│   ├── bookings/            # My Bookings screen
│   ├── dashboard/           # Student dashboard screen
│   ├── deck/                # Interactive 15-screen gallery
│   ├── login/               # Login screen
│   ├── notifications/       # Notifications center screen
│   ├── profile/             # Profile screen
│   ├── resources/           # Browse & details screens
│   ├── signup/              # Signup screen
│   ├── welcome/             # Welcome & onboarding screen
│   ├── globals.css          # Tailwind theme & root styles
│   ├── layout.tsx           # Global AppProvider & AppWrapper
│   └── page.tsx             # Root redirect / landing
├── components/
│   ├── layout/              # TopHeader, AppWrapper, PhoneMockup, StatusBar
│   ├── navigation/          # BottomNav, Sidebar
│   ├── screens/             # 15 standalone screen components
│   └── ui/                  # Modal, Dialogs, Cards
├── context/
│   └── AppContext.tsx       # State, auth, CRUD, and live PostgreSQL API sync
├── lib/
│   ├── db.ts                # PostgreSQL Pool, auto-migration & query helpers
│   ├── mock-data.ts         # Dataset references
│   ├── types.ts             # TypeScript interfaces
│   └── utils.ts             # ID generators and formatters
├── scripts/
│   └── init-db.js           # Standalone PostgreSQL table creation & seed script
├── tailwind.config.ts       # Custom cream/peach color theme
└── tsconfig.json
```

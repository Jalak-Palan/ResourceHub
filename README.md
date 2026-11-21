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
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom palette and soft shadows
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) schemas (User, Resource, Booking, Notification)
- **Persistence**: Graceful hybrid mode with automatic fallback to memory/localStorage demo mode when MongoDB credentials are not provided.
- **Micro-interactions**: Canvas Confetti for celebrations, SVG smooth spline charts for analytics.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration (Optional MongoDB)
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/resourcehub?retryWrites=true&w=majority
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
> **Note**: If `MONGODB_URI` is omitted, ResourceHub automatically operates in a full-featured **Demo Mode** with realistic data and LocalStorage persistence.

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
│   │   ├── bookings/        # GET, POST booking records
│   │   ├── notifications/   # GET, PATCH alerts
│   │   ├── resources/       # GET, POST equipment inventory
│   │   └── stats/           # GET dashboard metrics
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
│   └── AppContext.tsx       # State, auth, CRUD, and LocalStorage sync
├── lib/
│   ├── mock-data.ts         # Realistic sample dataset
│   ├── mongodb.ts           # Mongoose connection handler
│   ├── types.ts             # TypeScript interfaces
│   └── utils.ts             # ID generators and formatters
├── models/
│   ├── Booking.ts           # Mongoose Booking schema
│   ├── Notification.ts      # Mongoose Notification schema
│   ├── Resource.ts          # Mongoose Resource schema
│   └── User.ts              # Mongoose User schema
├── tailwind.config.ts       # Custom cream/peach color theme
└── tsconfig.json
```

---

## 🎨 Color Palette Reference

| Name | Hex Code | Purpose |
|------|----------|---------|
| Main Background | `#FFF7F1` | Warm cream backdrop across all screens |
| Primary Peach | `#E77B52` | Accent buttons, active tabs, brand icons |
| Secondary Peach | `#FCEEE5` | Card pills, light badges, active state borders |
| Dark Text | `#29201D` | High-contrast typography |
| Muted Text | `#89817D` | Secondary labels, descriptions, subtitles |
| Soft Green | `#E8F8EE` / `#16A34A` | Available status, Approved badges |
| Soft Red | `#FEE2E2` / `#DC2626` | Rejected badges, delete actions |

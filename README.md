# Cally - Appointment Scheduling App

[![Laravel](https://img.shields.io/badge/Laravel-12-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC.svg)](https://tailwindcss.com)

A modern, Calendly-inspired appointment scheduling application that allows users to set their availability, share booking links, and let visitors schedule appointments seamlessly.

## ✨ Features

### 🔐 Core Features
- **User Registration & Authentication** - Secure user accounts with Laravel Sanctum
- **Availability Management** - Set weekly recurring availability with 30-minute time slots
- **Public Booking System** - Share your booking link for visitors to schedule appointments
- **Interactive Calendar** - Intuitive date and time slot selection interface
- **Double-booking Prevention** - Concurrent booking protection with Redis locks
- **Timezone Support** - Automatic timezone detection and conversion

### 🛠️ Technical Highlights
- **Clean Architecture** - SOLID principles with service/repository pattern
- **Data Transfer Objects (DTOs)** - Type-safe data transfer between layers
- **Standardized API Responses** - Consistent API response format
- **Optimistic Concurrency Control** - Prevents race conditions during booking
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS

## 🏗️ Architecture

### Backend (Laravel)
```
backend/
├── app/
│   ├── DTOs/                 # Data Transfer Objects
│   ├── Enums/                # Enum definitions
│   ├── Helpers/              # Helper classes (ApiResponse, etc.)
│   ├── Http/
│   │   ├── Controllers/      # API Controllers
│   │   ├── Requests/         # Form Requests for validation
│   │   └── Service/          # Business logic services
│   ├── Models/               # Eloquent models
│   └── Providers/            # Service providers
├── database/
│   └── migrations/           # Database migrations
└── routes/
    └── api.php               # API route definitions
```

### Frontend (React)
```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── availability/     # Availability management components
│   │   ├── booking/          # Booking form components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── sections/         # Page sections
│   │   └── ui/               # UI primitives
│   ├── contexts/             # React contexts (Auth, etc.)
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities and helpers
│   │   └── api/              # API client setup
│   ├── pages/                # Page components
│   │   ├── dashboard/        # Dashboard pages
│   │   └── public/           # Public pages
│   ├── services/             # API service modules
│   └── types/                # TypeScript type definitions
```

## 🗄️ Database Schema

### Core Entities

**Users**
- Represents both hosts (who set availability) and guests (who book appointments)
- Stores authentication details, profile information, and timezone

**Availability**
- Defines when a host is available for bookings
- Organized by day of week with start/end times
- Recurring weekly schedule

**Bookings**
- Represents a scheduled appointment
- Links host and guest users
- Contains booking time, notes, and meeting details

### Database Tables
```sql
users
├── id
├── name
├── username (unique)
├── email
├── password
├── timezone
└── timestamps

availabilities
├── id
├── user_id (foreign key)
├── day_of_week (enum)
├── start_time
├── end_time
├── is_available (boolean)
└── timestamps

bookings
├── id
├── host_user_id (foreign key)
├── guest_user_id (foreign key)
├── booking_time
├── notes (nullable)
├── meeting_link (nullable)
└── timestamps
```

## 🚀 Installation

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 16+
- npm or yarn
- MySQL/PostgreSQL
- Redis (for booking locks)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Create and configure your environment file:**
   ```bash
   cp .env.example .env
   ```
   Update the database and Redis connection details in `.env`

4. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

5. **Run database migrations:**
   ```bash
   php artisan migrate
   ```

6. **Start the development server:**
   ```bash
   php artisan serve
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install JavaScript dependencies:**
   ```bash
   npm install
   ```

3. **Create and configure your environment file:**
   ```bash
   cp .env.example .env
   ```
   Set the `VITE_API_URL` to your backend API URL

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 📖 Usage

### Setting Your Availability

1. Register and log in to your account
2. Navigate to the Availability settings
3. Set your weekly availability by day and time
4. Save your settings

### Sharing Your Booking Link

1. Copy your unique booking link from the dashboard
2. Share with potential guests via email, social media, etc.

### Booking Process (for Guests)

1. Visit a host's booking link
2. Select an available date from the calendar
3. Choose an available time slot
4. Fill in your details and any notes
5. Confirm the booking

## ⚙️ Technical Implementation

### Booking Flow

1. Frontend fetches available dates/times from the API
2. User selects a date and time slot
3. Booking request is sent to the API
4. Backend uses Redis locks to prevent double-booking
5. Database transaction ensures data integrity
6. Confirmation is returned to the frontend

### Preventing Double Bookings

The application uses Redis locks to handle concurrent booking attempts:

```php
$booking = Cache::lock("booking:$bookingDTO->booking_time", 5)->get(function () {
    DB::beginTransaction();
    $booking = $this->bookingService->createBooking($bookingDTO, $guestUser);
    DB::commit();
    return $booking;
});
```

### Time Slot Generation

Time slots are generated based on host availability and existing bookings:

1. Retrieve the host's weekly availability settings
2. Generate 30-minute slots for each available day
3. Filter out slots that are already booked
4. Filter out past time slots for the current day

## 🛠️ Tech Stack

- **Backend:** Laravel 12, PHP 8.1+, MySQL/PostgreSQL, Redis
- **Frontend:** React 19, TypeScript, Tailwind CSS 4
- **UI Components:** Shadcn UI (Radix UI based)
- **HTTP Client:** Axios
- **Authentication:** Laravel Sanctum

## 🔮 Future Enhancements

- 📧 Email notifications for bookings and reminders
- 📅 Calendar integration (Google Calendar, Outlook)
- ❓ Custom booking questions
- 👥 Group event types
- 🔄 Recurring appointments
- 📊 Analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help with setup, please open an issue on GitHub.

---

**Made with ❤️ using Laravel and React**

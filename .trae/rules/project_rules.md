My System is Windows and I mostly use git bash terminal.

I am a full stack developer, and I would like to code with 100% project standards, maintaining the code readability and the best practices. I always want to follow the best practices and readability and follow the SOLID principles and Other Design Patterns.

So Whenever I am working on the project generate the code with the best practices and readability. There should be zero compromise on this. I want to generate the code as production grade code like the code of Google and Facebook engineers.

Whenever I ask something first check my whole codebase and understand how I approach the problem and code implementation and follow the same approach for the code you are providing. Like using service class, FormRequest, Repository, Model, Controller, Route, Middleware, etc.

System & Environment
OS: Windows (Primary), but solutions should be cross-platform where possible

Terminal: Git Bash (Unix-like commands preferred)

Code Quality: Production-grade with zero compromise on:

Best practices

Readability (self-documenting code)

Maintainability (modular, decoupled)

Performance & Security

Core Development Principles

1. SOLID Principles (Strictly Enforced)
   Single Responsibility (Each class/module does one thing)

Open/Closed (Open for extension, closed for modification)

Liskov Substitution (Subtypes must be replaceable)

Interface Segregation (No forced dependencies)

Dependency Inversion (Depend on abstractions, not concretions)

2. Design Patterns (When Appropriate)
   Creational: Factory, Builder, Singleton (only when justified)

Structural: Adapter, Decorator, Facade, Composite

Behavioral: Strategy, Observer, Command, Repository

3. Clean Code Standards
   Naming: Explicit over implicit (getUserById() vs fetch())

Functions: Small, single-purpose, pure where possible

Comments: Only for "why" (not "what")

Error Handling: Structured, meaningful errors (no silent fails)

Full-Stack Architecture Guidelines
Frontend (If Applicable)
Component-Based (React/Vue/Angular-like separation)

State Management: Predictable (Redux, Pinia, etc.)

Type Safety: TypeScript preferred

UI/UX: Accessibility (a11y), responsive design

Backend (API/Server)
Layered Architecture:

Routes/Controllers (HTTP handling)

Services (Business logic)

Repositories/DAO (Data access)

Models/DTOs (Data structures)

API Design: RESTful (or GraphQL with strict schema)

Validation: Input sanitization, schema validation (Zod, Joi, etc.)

Auth: JWT/OAuth with secure storage

Database
ORM/Query Builder: Structured queries (avoid raw SQL unless optimized)

Migrations: Version-controlled schema changes

Indexing & Optimization: Explain plans, no N+1 queries

Testing
Unit Tests: Isolated, fast (Jest, Mocha, pytest)

Integration Tests: API contracts, DB interactions

E2E Tests: Critical user flows (Cypress, Playwright)

AI Assistance Rules
✅ Before suggesting code:

Analyze existing patterns in the codebase.

Ensure consistency with the current architecture.

Follow the strictest production standards (like FAANG-level code).

✅ Code must be:
✔ Modular (Easy to replace/extend)
✔ Decoupled (Low dependency chains)
✔ Testable (Mockable, no hidden side effects)
✔ Secure (No SQLi, XSS, auth flaws)
✔ Performant (No memory leaks, O(n) awareness)

❌ Never:

Suggest quick hacks that violate SOLID.

Ignore error handling or edge cases.

Use ambiguous naming (data, temp, obj).

🚨 Zero-Tolerance Rules
No untested code → If I can’t verify it, I won’t suggest it.

No anti-patterns → God objects, magic strings, silent fails.

No ambiguity → Every function’s purpose must be immediately clear.

Strict Code Quality Assurance Protocol
🔒 AI Code Review & Testing Guarantee
Before delivering any code solution, I will:

✅ Self-Test Every Component

Run static analysis (linting, type checking).

Verify logic with manual test cases.

Check edge cases (empty inputs, error states).

✅ Ensure SOLID & Design Pattern Compliance

Validate against the Single Responsibility Principle.

Confirm proper abstraction layers (no leaky implementations).

✅ Security & Performance Audit

Check for SQLi, XSS, CSRF risks in backend code.

Verify time complexity (avoid accidental O(n²)).

Ensure no memory leaks (especially in frontend).

✅ Cross-Check Against Your Codebase

Match your existing naming conventions.

Align with your project structure (services, repositories, etc.).

✅ Provide Test Coverage (If Applicable)

Include unit tests (Jest, pytest, etc.).

Suggest integration test cases.

Strict Validation Protocol for Concurrent Operations

1. Race Condition Detection Checklist
   Before delivering any code, I will:

Analyze your existing code for:

Shared resource access (DB rows, files, memory)

Non-atomic operations (read-modify-write cycles)

Missing locks/mutexes in critical sections

Flag potential risks like:

Double bookings in reservation systems

Inventory overselling in e-commerce

Duplicate payments in financial systems

3. Edge Case Coverage Mandate
   Every solution must handle:

Edge Case Protection Method
Double form submission Idempotency tokens
Concurrent API calls Distributed locks (Redis, etc.)
Network timeouts Transaction rollback recovery
Partial failures Saga pattern compensation 4. Verification Process
I'll simulate race conditions using:

Parallel request testing (Postman, Artillery)

Database stress tests

Verify through:

ACID compliance checks

Isolation level validation (READ COMMITTED vs SERIALIZABLE)

5. Immediate Red Flags
   I'll alert you if I find:

Raw SQL queries without FOR UPDATE in critical sections

API endpoints missing idempotency keys

Eventual consistency where strong consistency is needed

Next Steps:
When you share code, I'll:

Perform full concurrency audit

Provide specific fixes for any found issues

Suggest monitoring (OpenTelemetry metrics for contention)

# -----------------------------------------------------------------------------------------------------

# Project-Specific Context for Trae IDE

(Calendly-Style Appointment Scheduler with React + Laravel)

✨ Frontend Standards (React + Redux + TailwindCSS)

1. Component Architecture
   Atomic Design Structure:

src/
├── app/ # App-wide configuration
│ ├── layout/ # Root layouts
│ ├── routing/ # Route definitions
│ └── providers.tsx # All context providers
├── assets/
│ ├── fonts/ # Custom fonts
│ ├── images/ # Optimized images
│ └── styles/ # Global CSS/Sass
├── common/ # Shared UI components
│ ├── ui/ # ShadCN-like primitives
│ │ ├── button/
│ │ ├── dialog/
│ │ └── ... # Component folders with tests
│ ├── layout/ # Grids, containers
│ └── providers/ # Reusable context providers
├── features/
│ ├── auth/ # Authentication
│ │ ├── components/ # LoginForm, etc.
│ │ ├── stores/ # Auth state
│ │ └── hooks/
│ │ ├── useAuth.ts # Main auth hook
│ │ └── useSession.ts # Session management
│ ├── booking/ # Booking feature
│ │ ├── api/ # RTK Query endpoints
│ │ ├── components/ # Feature-specific UI
│ │ │ ├── Calendar/
│ │ │ ├── TimeSlots/
│ │ │ └── BookingForm/
│ │ ├── hooks/
│ │ │ ├── useBooking.ts # Booking logic
│ │ │ └── useCalendar.ts # Date navigation
│ │ ├── stores/ # Zustand/Redux slices
│ │ ├── types/ # Feature types
│ │ └── utils/ # Date formatters etc.
│ └── availability/ # Availability management
├── lib/ # Utilities
│ ├── api/ # Axios instances
│ ├── constants/ # App-wide constants
│ ├── helpers/ # Pure functions
│ └── logging/ # Logger setup
├── providers/ # App-level providers
│ ├── ThemeProvider.tsx
│ ├── QueryProvider.tsx # React Query/RTK
│ └── AnalyticsProvider.tsx
├── stores/ # Global state
│ ├── rootReducer.ts # Redux combineReducers
│ └── useAppStore.ts # Zustand store
├── test/ # Testing
│ ├── mocks/ # MSW handlers
│ ├── utils/ # Render helpers
│ └── test-utils.tsx # Custom render
└── types/ # Global types
├── api.d.ts # API response shapes
└── theme.d.ts # Theme types
Rule: No JavaScript logic in components (use custom hooks).

Example:

jsx
// GOOD: Logic extracted to hook
const { availableSlots, loading } = useAvailableSlots(userId, date);

// BAD: Logic inside component
const fetchSlots = () => { /_ ... _/ }; // ❌ 2. State Management
Redux (If Needed):

Use createSlice (Redux Toolkit)

Async actions via createAsyncThunk

Never mutate state directly

3. UI/UX Standards
   TailwindCSS Config:

js
// tailwind.config.js
theme: {
extend: {
colors: {
primary: 'var(--color-primary)',
secondary: 'var(--color-secondary)',
}
}
}
CSS Variables (in index.css):

css
:root {
--color-primary: #3b82f6;
--color-secondary: #10b981;
}
Animations: Use Framer Motion or Tailwind transition-\*.

jsx
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} /> 4. API Communication
Axios Instance:

js
// src/api/client.js
export const api = axios.create({
baseURL: import.meta.env.VITE_API_URL,
headers: { 'Authorization': `Bearer ${token}` }
});
React Query for Data Fetching:

js
const { data } = useQuery(['slots', date], () => api.get(`/slots?date=${date}`)); 5. Responsive & Accessible
Mobile-first Tailwind classes (sm:, md:).

Semantic HTML (<section>, <article>).

ARIA labels for interactive elements.

🔥 Backend Standards (Laravel API)

1. Layered Architecture
   app/
   ├── Http/
   │ ├── Controllers/ (Thin controllers)
   │ ├── Requests/ (FormRequest validation)
   │ └── Resources/ (API Resources)
   ├── Services/ (Business logic)
   ├── Repositories/ (DB operations)
   └── DTOs/ (Data Transfer Objects)
2. Critical Standards
   FormRequest for Validation:

php
class BookingRequest extends FormRequest {
public function rules() {
return [
'email' => 'required|email',
'slot_id' => 'required|exists:slots,id',
];
}
}
Service Layer Pattern:

php
class BookingService {
public function bookSlot(BookingDTO $dto): Appointment {
// Business logic here
}
}
API Resources for Responses:

php
class SlotResource extends JsonResource {
public function toArray($request) {
return ['id' => $this->id, 'start' => $this->start_time];
}
} 3. DTO Usage
Controller → Service → Repository:

php
// Controller
public function store(BookingRequest $request) {
  $dto = new BookingDTO($request->validated());
$appointment = (new BookingService)->bookSlot($dto);
return new AppointmentResource($appointment);
} 4. Laravel Sanctum (Auth)
SPA Authentication:

php
// routes/api.php
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Magic Number/Variable Ban:

php
// GOOD
const MAX_BOOKINGS_PER_DAY = 5; // ✅

// BAD
if ($count > 5) { /_ ... _/ } // ❌ 5. Testing & Security
Pest Feature Tests:
OWASP Checks:

CSRF protection (Laravel built-in)

SQL injection guarded via Eloquent

XSS prevention via Blade escaping

🚀 Project-Specific Details (From Your Brief)
Core Features:

Calendar slot selection (like Calendly)

Booking form with name/email

Anti-double-booking logic

Tech Stack:

Frontend: React + Redux + shadcn/ui + Tailwind

Backend: Laravel + Sanctum + DTOs

Timebox: 4-5 hours (MVP focus)

✅ Final Quality Checklist
React components are pure (no side effects)

Tailwind colors use CSS variables

Laravel uses strict type-hinting

Zero magic numbers/strings

All API responses wrapped in Resources

Transactions for critical DB operations

Hey I am using Laravel 12 React 19 and Tailwind 4

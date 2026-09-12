# BugTrack Backend

The backend is an Express 5 API backed by MongoDB and Mongoose. It is the source of truth for bugs, users, admins, authentication, and authorization. JWTs expire after one day.

## Prerequisites

- Node.js and npm
- A running local MongoDB instance or a MongoDB Atlas database
- Network access from the backend to MongoDB

Install dependencies separately in `backend` and `frontend`; there is no root npm application.

## Environment

Create `backend/.env` locally. Do not commit it.

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_long_random_secret
```

The frontend reads `VITE_API_URL` from its own `.env`. It defaults to `http://localhost:5000/api`; custom values must include the `/api` suffix.

## Commands

From `backend`:

```bash
npm install
npm run dev       # Node watch mode
npm start         # Single production-style process
```

Create an admin from `backend` with environment variables that are supplied only for that command:

```powershell
$env:ADMIN_NAME="System Admin"
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="use-a-strong-password"
npm run create-admin
```

Admin passwords are hashed with bcrypt. Public signup can create only normal users.

## Structure

- `server.js`: Express bootstrap, CORS, MongoDB connection, and route registration
- `models/`: Mongoose schemas for bugs, users, and admins
- `controllers/`: authentication, bug, and user request handlers
- `routes/`: authentication, bug, and user route definitions
- `middleware/authMiddleware.js`: JWT authentication and role checks
- `middleware/errorHandler.js`: validation, duplicate-key, and server errors
- `middleware/notFound.js`: JSON response for unknown routes
- `scripts/createAdmin.js`: command-line admin creation

## API

Send `Authorization: Bearer <token>` to every protected endpoint.

### Authentication

| Method | Endpoint | Access | Result |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | Public | Creates a normal user and returns a user JWT. |
| POST | `/api/auth/login` | Public | Validates normal-user credentials and returns a user JWT. |
| POST | `/api/auth/admin-login` | Public | Validates admin credentials and returns an admin JWT. |

Signup accepts `name`, `email`, and `password`. Email is trimmed and lowercased, and the password is never stored in plain text.

### Bugs

| Method | Endpoint | Access | Result |
| --- | --- | --- | --- |
| GET | `/api/bugs` | Authenticated | Lists the caller's bugs, or all bugs for an admin, newest first. |
| GET | `/api/bugs/:id` | Authenticated | Gets one bug subject to the same ownership rule. |
| POST | `/api/bugs` | Authenticated | Creates a bug with a server-generated sequential `BUG-###` ID. |
| PUT | `/api/bugs/:id` | Authenticated | Updates an owned bug or any bug for an admin. |
| DELETE | `/api/bugs/:id` | Authenticated | Deletes an owned bug or any bug for an admin. |

Bug input supports `title`, `description`, `priority`, `severity`, `assignedTo`, and `steps`. `title` is required. Valid values are `priority`: `Low`, `Medium`, `High`, `Critical`; `severity`: `Minor`, `Major`, `Critical`; and `status`: `Open`, `In Progress`, `Resolved`. The server controls `id` and `reportedBy`. User-created bugs receive the authenticated user's identity; admin-created bugs have no owner. Older records without an owner are treated as legacy records.

### Users and health

| Method | Endpoint | Access | Result |
| --- | --- | --- | --- |
| GET | `/api/users` | Admin only | Lists normal users for the admin dashboard. |
| GET | `/api/users/stats` | Authenticated user | Returns user bug statistics. |
| GET | `/api/health` | Public | Confirms that the Express health route responds; it does not independently verify MongoDB health. |

Successful responses return JSON. Common errors are `401` for missing or invalid authentication, `403` for an insufficient role or ownership, `404` for missing resources or routes, `400` for validation failures, and `409` for duplicate unique values. Error responses use a JSON `message` field where applicable.

## Verification

1. Start MongoDB, the backend, and the frontend.
2. Sign up at `/signup`, log in at `/login`, and confirm `/dashboard` loads.
3. Create, edit, delete, and refresh a bug to verify persistence.
4. Create an admin with `npm run create-admin`, then log in at `/admin/login`.
5. Confirm an admin can view all bugs and users while a normal user can access only owned bugs.
6. Confirm requests without a Bearer token return `401` and normal users receive `403` from `GET /api/users`.

Never commit credentials. Rotate any MongoDB password, admin password, or JWT secret that has been exposed.# BugTracker Backend

The application now uses an Express and MongoDB API as the source of truth for bugs. The existing React UI, routes, search, filters, dashboard statistics, edit modal, and delete confirmation remain in place.

## Recent Changes

- Added separate normal-user and admin authentication flows with role-bearing JWTs.
- Normal signup now accepts only user accounts, validates email format, and rejects duplicate email addresses.
- Admin accounts are created only through the backend `create-admin` command; passwords are bcrypt-hashed.
- Added server-side ownership checks using `reportedBy`, so users see and modify only their own bugs while admins can manage all bugs.
- Added admin-only user listing and user-only statistics endpoints.
- Added profile identity information and a single `USER`/`ADMIN` badge to the dashboard top-right profile.
- Added a shared dashboard top bar and monochrome dashboard theme; existing CRUD APIs and MongoDB storage remain unchanged.
- Added a persisted frontend light/dark theme toggle. This is presentation-only and does not change backend data or authentication behavior.
- The dashboard top-right profile contains the single `USER` or `ADMIN` badge; profile details are not duplicated in the sidebars. The toggle uses a moon icon for dark mode and a sun icon for light mode.
- Theme preference now applies across login, signup, admin login, user dashboard, admin dashboard, forms, tables, and sidebars. Authentication pages use a top-right theme control.
- Improved light-theme authentication welcome text contrast for readability; this is a frontend-only visual change.
- Refined shared statistic cards for user/admin dashboards and corrected the admin five-card layout; this is a frontend-only visual change.
- Removed the user/admin profile details from the sidebars; account identity remains available in the dashboard top-right profile.
- Removed the duplicate Dashboard button from Create Bug; the role-aware Back to Dashboard action remains.
- Fixed bug creation ID generation: the backend now correctly detects numeric `BUG-###` records and creates the next available ID without duplicate-key collisions.
- Fixed frontend authenticated request headers so JSON request bodies reach the Express parser during bug creation and updates.

## Structure

- `backend/server.js`: Express bootstrap, CORS, MongoDB connection, and route registration
- `backend/models/Bug.js`: Mongoose schema and field validation
- `backend/controllers/bugController.js`: CRUD handlers and generated `BUG-###` IDs
- `backend/routes/bugRoutes.js`: REST route definitions
- `backend/models/Admin.js`: admin account model with hashed passwords
- `backend/models/User.js`: normal user account model with hashed passwords
- `backend/controllers/authController.js`: signup and login handlers
- `backend/controllers/userController.js`: user statistics and admin user listing
- `backend/routes/authRoutes.js`: authentication endpoints
- `backend/routes/userRoutes.js`: user statistics and admin user management endpoints
- `backend/middleware/authMiddleware.js`: JWT protection for bug routes
- `backend/middleware/errorHandler.js`: validation, duplicate, and server error responses
- `backend/middleware/notFound.js`: JSON response for unknown routes
- `frontend/src/context/BugContext.jsx`: fetch-based state and CRUD integration

## Configure MongoDB

1. Install and start MongoDB locally, or create a MongoDB Atlas deployment.
2. Copy the connection string into `backend/.env` as `MONGO_URI`. The committed local example is:

   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_long_random_secret
   ```

   For Atlas, use your private connection string and keep that file uncommitted. Do not put credentials in frontend files. Rotate any database password that has been shared publicly.
3. To use a different API address, create `frontend/.env` from `frontend/.env.example` and set `VITE_API_URL` (including `/api`).

## Install and run

From `backend`:

```bash
npm install
npm run dev
```

From `frontend` in a second terminal:

```bash
npm install
npm run dev
```

The Vite app defaults to `http://localhost:5173`; the API defaults to `http://localhost:5000`.

## API

| Method | Endpoint | Result |
| --- | --- | --- |
| GET | `/api/bugs` | List bugs, newest first |
| GET | `/api/bugs/:id` | Get one bug |
| POST | `/api/bugs` | Create a validated bug |
| PUT | `/api/bugs/:id` | Update a validated bug |
| DELETE | `/api/bugs/:id` | Delete a bug |
| GET | `/api/health` | API health check |

Authentication endpoints are public:

| Method | Endpoint | Result |
| --- | --- | --- |
| POST | `/api/auth/signup` | Create a normal user with a bcrypt-hashed password |
| POST | `/api/auth/login` | Validate normal-user credentials and return a user JWT |
| POST | `/api/auth/admin-login` | Validate admin credentials and return an admin JWT |

Public signup always creates `role: "user"`; it never accepts a role from the request. Admin accounts are created from the backend with hashed passwords:

```powershell
$env:ADMIN_NAME="System Admin"
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="use-a-strong-password"
npm --prefix .\backend run create-admin
```

All `/api/bugs` endpoints require `Authorization: Bearer <token>`. Users only see and modify bugs whose `reportedBy` matches their JWT identity. Admins can manage all bugs. `GET /api/users` is admin-only and `GET /api/users/stats` is user-only.

User signup trims and lowercases email addresses, rejects invalid email formats, and prevents duplicate addresses with both an application check and the database unique index. The same email cannot be registered as both a user and an admin. Passwords are never stored in plain text. After login, the dashboard top-right profile shows the account name, email, and one `USER` or `ADMIN` profile badge; sidebars contain navigation, theme, and logout controls only.

Valid values are `priority`: `Low`, `Medium`, `High`, `Critical`; `severity`: `Minor`, `Major`, `Critical`; and `status`: `Open`, `In Progress`, `Resolved`. `title` is required.

## Verification checklist

1. With MongoDB and the backend running, open the frontend and confirm the list loads from the API.
2. Create a bug and confirm it appears in All Bugs and persists after a refresh.
3. Edit its title, priority, severity, or status and refresh to confirm the update persists.
4. Delete it and refresh to confirm it remains deleted.
5. Stop MongoDB or the API and confirm the UI shows a request error rather than silently changing local data.
6. Open `/signup`, create a normal user, then log in at `/login` and confirm `/dashboard` opens.
7. Create a backend admin with the `create-admin` command, then log in at `/admin/login` and confirm `/admin/dashboard` opens.
8. Confirm a normal user cannot open `/admin/dashboard` and a normal-user token receives `403` from `GET /api/users`.
9. Create a bug as a normal user and confirm its `reportedBy` is assigned server-side; log in as another user and confirm it is not returned.
10. Confirm a direct request to `/api/bugs` without a Bearer token returns `401`.
11. Use either sidebar `Log out` action and confirm the matching login page opens.

The frontend build and lint commands remain unchanged:

```bash
npm run lint
npm run build
```

# BugTracker Backend

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

User signup trims and lowercases email addresses, rejects invalid email formats, and prevents duplicate addresses with both an application check and the database unique index. The same email cannot be registered as both a user and an admin. Passwords are never stored in plain text. After login, the sidebars show the account name, email, and a `USER` or `ADMIN` profile badge.

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

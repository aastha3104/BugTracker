# BugTrack Database

This document intentionally contains no live credentials. Store MongoDB connection strings, admin passwords, and `JWT_SECRET` only in ignored local environment files. Any credentials previously placed in this file should be rotated.

## Connection

The backend reads its MongoDB connection from `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
```

Use a local MongoDB URI for development or a private MongoDB Atlas URI for hosted development. Do not place either URI in frontend source or commit it to the repository.

## Collections

Mongoose creates these collections from the backend models:

### `users`

Normal application accounts contain a name, a unique normalized email, and a bcrypt-hashed password. The model also stores timestamps. Public signup always creates a normal user and cannot choose an admin role.

### `admins`

Admin accounts contain a name, a unique normalized email, and a bcrypt-hashed password. Create them with `backend/scripts/createAdmin.js`, not public signup.

### `bugs`

Bug records contain the server-generated unique `id` (`BUG-###`), title, description, priority, severity, status, assignee, reproduction steps, and timestamps. `reportedBy` identifies the owning user when a normal user creates the bug. Admin-created or older records may have no owner.

Allowed values:

- Priority: `Low`, `Medium`, `High`, `Critical`
- Severity: `Minor`, `Major`, `Critical`
- Status: `Open`, `In Progress`, `Resolved`

The bug ID and ownership field are controlled by the server. Users can read and modify only their own bugs; admins can manage all bugs.

## Indexes and integrity

- User email is unique.
- Admin email is unique.
- Bug ID is unique.
- Passwords are hashed before storage.
- Timestamps are maintained by Mongoose.

Application checks and database unique indexes both protect account email uniqueness, including user/admin duplicates and concurrent requests.

## Admin and data operations

From `backend`, install dependencies and create an admin with temporary environment variables:

```powershell
$env:ADMIN_NAME="System Admin"
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="use-a-strong-password"
npm run create-admin
```

The application has no migration or seed command for bug data. Use MongoDB's supported backup and restore tools for backups, and restrict database users to the permissions required by the application. Rotate database credentials and `JWT_SECRET` immediately if they are exposed.
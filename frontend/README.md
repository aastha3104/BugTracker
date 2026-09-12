# BugTrack Frontend

BugTrack is a React 19 and Vite dashboard for reporting and managing bugs through the Express/MongoDB backend. Normal users can create and manage their own bugs. Admins can inspect all bugs and registered users.

## Requirements and commands

Install a current Node.js/npm release, then run commands from `frontend`:

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

The development server defaults to `http://localhost:5173`.

## Configuration

The frontend reads `VITE_API_URL` from `frontend/.env`. It defaults to `http://localhost:5000/api`. Custom values must include `/api`, for example:

```env
VITE_API_URL=http://localhost:5000/api
```

Do not put database credentials or JWT secrets in frontend environment files.

## Routes

| Path | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Redirects to `/login`. |
| `/login` | Public | Normal-user login. |
| `/signup` | Public | Normal-user registration. |
| `/admin/login` | Public | Admin login. |
| `/dashboard` | Authenticated user | User bug summary and table. |
| `/bugs` | Authenticated user | Search, filter, edit, and delete owned bugs. |
| `/create-bug` | Authenticated user | Submit a bug report. |
| `/admin/dashboard` | Admin | System-wide bug and user summary. |
| `/admin/users` | Admin | List registered normal users. |

Unauthenticated protected routes redirect to `/login`. A role-incompatible route redirects to the appropriate dashboard. Backend JWT and role checks remain authoritative; frontend guards are navigation behavior only.

## User interface behavior

`BugContext` loads bugs from the API and owns CRUD state. The dashboard's `Recent Bugs` table currently renders every loaded bug; it does not sort or limit the list on the client. The analytics trend values are synthetic display values derived from the current total, not historical API data. The dashboard search and topbar utility, message, and notification controls are visual/local UI elements; topbar search is not connected to bug filtering.

The edit modal updates only title, priority, severity, and status. Description, assignee, and reproduction steps are not editable there. The page title in `index.html` is still `frontend`.

Admin statistics use the general responsive stats grid; there is no dedicated five-column layout rule.

## Browser storage

- `bugtracker_token`: the current JWT
- `bugtracker_user`: non-sensitive signed-in user display data
- `bugtracker_theme`: the selected light/dark theme

Bug records are fetched from the backend and are not persisted in browser storage.

## Current limitations

- No pagination or server-side search/filtering
- No bug detail page
- No admin bug assignment workflow
- Topbar search, messages, and notifications are not functional features
- No automated test suite is included
# BugTrack Frontend

## Concept

BugTrack is a small bug tracking dashboard built with React, Vite, Express, and MongoDB. It lets a user view issue statistics, create bugs, search and filter the bug list, edit existing bugs, and delete bugs.

Bug records are persisted in MongoDB through the backend API. The frontend keeps the current API response in React state for rendering and does not persist bug data in the browser.

The user and admin dashboards share a black-and-white visual system inspired by the supplied dashboard reference: a light workspace, white data surfaces, compact stat cards, grayscale analytics, left navigation, profile identity, and a top utility bar. Existing bug workflows and responsive behavior remain available.

## Recent Changes

- Added `DashboardTopbar.jsx`, shared by both dashboards for search, utility controls, and signed-in profile display.
- Added a monochrome dashboard theme in `src/App.css` with light-gray workspace backgrounds, white panels, black primary actions, grayscale charts, and responsive mobile rules.
- Added `ThemeContext.jsx` and `ThemeToggle.jsx` for a persisted light/dark theme switch across the application.
- Moved the role badge to one badge beside the top-right dashboard profile and removed profile details from the sidebars.
- Changed the theme control to an icon-only toggle: the moon switches to dark mode and the sun switches to light mode.
- Applied the persisted theme across login, signup, admin login, user dashboard, admin dashboard, forms, tables, and sidebars. Auth pages use a consistent top-right control.
- Increased light-theme authentication welcome text contrast so the heading and supporting text remain clearly readable.
- Refined shared `StatCard` presentation for both dashboards and added a five-column wide-screen layout for admin statistics, with responsive stacking retained.
- Removed the duplicate `Dashboard` button from the Create Bug page; the role-aware `Back to Dashboard` button is now the single return control.
- Updated `AnalyticsPanel.jsx` to use grayscale chart and status colors.
- Preserved existing bug statistics, CRUD actions, search, filters, edit modal, delete confirmation, and MongoDB-backed state.

## Application Flow

```text
main.jsx
  -> App
      -> BugProvider
          -> BrowserRouter
              -> route
                  -> page
                      -> shared components
```

1. `src/main.jsx` mounts the React application into the `#root` element and imports the global stylesheet.
2. `src/App.jsx` wraps the routes in `AuthProvider` and `BugProvider`, so role-aware pages share session and bug state.
3. `BrowserRouter` selects a page based on the URL.
4. Pages call context actions or render context data.
5. Create, update, and delete operations call the backend and update React state from the successful API response.

## Routes

| Path | Page | Purpose |
| --- | --- | --- |
| `/` | Redirect | Redirects to `/login`. |
| `/login` | `Login` | Authenticates normal users. |
| `/signup` | `Signup` | Creates a normal user account. |
| `/admin/login` | `AdminLogin` | Authenticates admins. |
| `/dashboard` | `Dashboard` | Shows counts for total, open, in-progress, and resolved bugs, plus a recent bug table. |
| `/admin/dashboard` | `AdminDashboard` | Shows system-wide bug and user totals. |
| `/bugs` | `AllBugs` | Shows every bug with search, status filtering, priority filtering, editing, and deletion. |
| `/create-bug` | `CreateBug` | Provides the form for reporting a new bug. |
| `/admin/users` | `Users` | Shows registered normal users to admins. |

Navigation is handled with React Router links and `useNavigate` calls. Protected pages require a JWT from `AuthContext`.

## Authentication

`AuthContext` calls the appropriate login endpoint and stores the returned JWT and non-sensitive user display data in browser storage. `ProtectedRoute` guards authenticated pages; `RoleProtectedRoute` enforces the user/admin split. Logout clears the session. `BugContext` includes the JWT as a Bearer token for every bug API request.

`/login` creates user sessions and `/admin/login` creates admin sessions. `RoleProtectedRoute` prevents users from entering admin pages and prevents admins from entering the normal user dashboard. Public signup never accepts a role. Admin accounts are created with the backend `create-admin` command.

Signup validates email format and the backend rejects duplicate email addresses, including database-level duplicate-key races. The user sidebar displays the signed-in user's name, email, and `USER` profile badge; the admin sidebar displays the same profile information with an `ADMIN` badge.

## State Management

`src/context/BugContext.jsx` is the central state layer and API client.

### Initial data

On initialization, the provider requests `GET /api/bugs`. An empty MongoDB collection produces an empty list; it does not fall back to browser-local seed data.

### Bug shape

A bug can contain these fields:

```js
{
  id: "BUG-001",
  title: "Login button not working",
  description: "...",
  priority: "High",
  severity: "Critical",
  status: "Open",
  assignedTo: "Developer name",
  steps: "1. Open login page..."
}
```

The initial records only define the fields needed by the dashboard table. Newly created records also include description, assignee, and reproduction steps. The list UI supplies fallback display values when older or incomplete records do not have priority, severity, or status.

### Context actions

- `addBug(newBug)` sends a `POST /api/bugs` request and appends the server response.
- `updateBug(id, updatedData)` sends a `PUT /api/bugs/:id` request and replaces the matching record with the server response.
- `deleteBug(id)` sends a `DELETE /api/bugs/:id` request and removes the record after success.
- `useBugs()` exposes the context to components.

## Page Behavior

### Dashboard

`Dashboard.jsx` reads `bugs` from context and calculates four counts by filtering on `bug.status`. It renders `Sidebar`, four `StatCard` instances, and `BugTable`. The create button navigates to `/create-bug`.

`BugTable.jsx` renders the shared table used on the dashboard. The `View All` button navigates to `/bugs`. Badge class names are generated from priority, severity, and status values so CSS can color each category.

### All Bugs

`AllBugs.jsx` owns temporary UI state for:

- Search text
- Selected status filter
- Selected priority filter
- The bug currently being edited

Filtering is performed in memory. Search matches only the bug title, case-insensitively. Status and priority filters require exact matches. Editing opens an in-page modal; saving sends the edited title, priority, severity, and status to `updateBug`. Description, assignee, and reproduction steps are not editable in this modal. Deletion requires `window.confirm` before calling `deleteBug`.

### Create Bug

`CreateBug.jsx` owns a controlled form with title, description, priority, severity, assignee, and reproduction steps. Title is required by the browser. On submit it calls `addBug`, resets the form, and navigates to `/bugs`.

## Component Responsibilities

- `Sidebar.jsx`: Brand label, primary route links, theme toggle, and logout action.
- `AdminSidebar.jsx`: Admin navigation, theme toggle, and logout action.
- `DashboardTopbar.jsx`: Search, utility controls, profile information, and the single user/admin role badge.
- `ThemeToggle.jsx`: Icon-only moon/sun theme switch.
- `StatCard.jsx`: Reusable statistic display with a title, value, and status-specific supporting text. The current callers do not pass an icon or type, so those optional visual hooks are unused.
- `BugTable.jsx`: Dashboard's read-only bug table.
- `Dashboard.jsx`: Summary page and dashboard composition.
- `AllBugs.jsx`: Full list management and edit modal.
- `CreateBug.jsx`: New bug form.

## Styling and Assets

- `src/index.css` contains the Vite starter global styles and root defaults.
- `src/App.css` contains the BugTrack UI styles, monochrome light/dark themes, fixed sidebar, tables, badges, forms, modal, buttons, and responsive rules.
- `public/favicon.svg` is the Vite-style favicon.
- `public/icons.svg` contains unused symbol definitions from the starter project.
- `src/assets/hero.png`, `react.svg`, and `vite.svg` are present assets; the current BugTrack screens do not import them.

The dashboard uses the monochrome theme described above. At widths below 700px, the sidebar becomes narrower, stats stack into one column, form rows stack, filters become vertical, and tables become horizontally scrollable.

## Tooling

The project is a Vite React app using:

- React 19
- React DOM 19
- React Router DOM 7
- Vite
- ESLint with React Hooks and React Refresh plugins

Run commands from the `frontend` directory:

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Current Limitations and Risks

- Bug data is stored in MongoDB and fetched through the authenticated backend API.
- Authentication and authorization are handled by the backend with JWT and role checks; bug data is not stored in localStorage.
- Bug IDs are generated by the backend and do not depend on the current frontend array length.
- The initial data is loaded from the backend; there is no browser-local bug fallback.
- The dashboard table renders all bugs despite its `Recent Bugs` label; it does not sort or limit records.
- `Sidebar` links do not explicitly set an active state, even though CSS includes an `.active` style.
- The edit modal does not edit description, assignee, or reproduction steps.
- The page title in `index.html` is still `frontend`, and the root README is still the default Vite template documentation.

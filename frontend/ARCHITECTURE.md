# BugTrack Frontend

## Concept

BugTrack is a small client-side bug tracking dashboard built with React and Vite. It lets a user view issue statistics, create bugs, search and filter the bug list, edit existing bugs, and delete bugs.

There is no backend or API in the current frontend. Bug records live in React state and are persisted in the browser's `localStorage` under the key `bugs`.

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
2. `src/App.jsx` wraps the routes in `BugProvider`, so every page can access the same bug collection.
3. `BrowserRouter` selects a page based on the URL.
4. Pages call context actions or render context data.
5. Create, update, and delete operations update React state and write the new collection to `localStorage`.

## Routes

| Path | Page | Purpose |
| --- | --- | --- |
| `/` | Redirect | Redirects to `/dashboard`. |
| `/dashboard` | `Dashboard` | Shows counts for total, open, in-progress, and resolved bugs, plus a recent bug table. |
| `/bugs` | `AllBugs` | Shows every bug with search, status filtering, priority filtering, editing, and deletion. |
| `/create-bug` | `CreateBug` | Provides the form for reporting a new bug. |

Navigation is handled with React Router links and `useNavigate` calls. There is no authentication or protected route behavior.

## State Management

`src/context/BugContext.jsx` is the central state layer.

### Initial data

The app starts with three in-memory bugs when no `localStorage` value exists:

- `BUG-001`: Login button not working
- `BUG-002`: Dashboard loading slowly
- `BUG-003`: Password validation issue

On initialization, the provider reads `localStorage.getItem("bugs")`. If a value exists, it parses that JSON and uses it instead of the defaults.

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

- `addBug(newBug)` appends a new record and generates an ID from the current array length, padded to three digits.
- `updateBug(id, updatedData)` merges the updated fields into the matching record.
- `deleteBug(id)` removes the matching record.
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

- `Sidebar.jsx`: Brand label and primary route links.
- `StatCard.jsx`: Reusable statistic display with a title, value, and status-specific supporting text. The current callers do not pass an icon or type, so those optional visual hooks are unused.
- `BugTable.jsx`: Dashboard's read-only bug table.
- `Dashboard.jsx`: Summary page and dashboard composition.
- `AllBugs.jsx`: Full list management and edit modal.
- `CreateBug.jsx`: New bug form.

## Styling and Assets

- `src/index.css` contains the Vite starter global styles and root defaults.
- `src/App.css` contains the BugTrack UI styles: dark dashboard layout, fixed sidebar, tables, badges, forms, modal, buttons, and responsive rules.
- `public/favicon.svg` is the Vite-style favicon.
- `public/icons.svg` contains unused symbol definitions from the starter project.
- `src/assets/hero.png`, `react.svg`, and `vite.svg` are present assets; the current BugTrack screens do not import them.

The dashboard uses a dark navy background with green accents. At widths below 700px, the sidebar becomes narrower, stats stack into one column, form rows stack, filters become vertical, and tables become horizontally scrollable.

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

- Data is browser-local only; users and devices do not share bugs.
- There is no server validation, authentication, authorization, or error handling for malformed `localStorage` JSON.
- New IDs use `bugs.length + 1`, so deleting a record and then adding another can reuse an existing ID.
- The initial data is not written to `localStorage` until the first mutation.
- The dashboard table renders all bugs despite its `Recent Bugs` label; it does not sort or limit records.
- `Sidebar` links do not explicitly set an active state, even though CSS includes an `.active` style.
- The edit modal does not edit description, assignee, or reproduction steps.
- The page title in `index.html` is still `frontend`, and the root README is still the default Vite template documentation.

# Faculty Portal Frontend

Production-ready Faculty Portal frontend built with React and Vite. It includes complete authentication flows, role-aware dashboard navigation, and core academic operations UI modules prepared for backend integration.

## Implemented Capabilities

### Authentication
- Login with validation and remember-me support
- Faculty sign-up with department selection and institutional email checks
- Forgot password and reset password flows
- Email verification screen (6-digit code)
- Two-factor verification screen (6-digit code)
- OAuth provider UI (Google, Facebook, Microsoft)
- Session indicator in dashboard layout

### Dashboard & Navigation
- Desktop sidebar + mobile drawer navigation
- Role-based navigation structure
- Top navigation with notifications, theme toggle, and user menu
- Dashboard summary cards and activity feed
- Quick action controls

### Core Modules
- Courses management with search/filter, create/edit modal, and details page
- Students management with table view, filters, pagination, profile modal, and bulk actions
- Attendance system with records calendar table, summary stats, mark attendance modal, and export UI action
- Assignments and grading with creation form, assignment list, submissions table, and grading feedback modal
- Messaging inbox with search, unread indicators, detail view, and compose modal
- Profile and settings with profile edit, password change, notification preferences, privacy controls, and security status

### Architecture & Quality
- Organized component hierarchy
- Reusable UI components (Button, InputField, Card, Modal, Badge, Dropdown, etc.)
- Context API for auth, theme persistence, and toast notifications
- Mock API service layer for backend-ready integration points
- Utility and constants layers
- Protected routes + error boundary
- Loading skeletons, empty states, and error states
- Accessible labels, semantic structure, and ARIA-friendly interactions

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```

This repository uses mocked asynchronous services (`src/services/mockApi.js`) to keep the frontend fully functional without requiring live backend responses.

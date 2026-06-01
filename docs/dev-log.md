# DevJudge Dev Log

## Initial database schema

Created the first database schema for DevJudge.

Added tables:

* users
* challenges
* test-cases
* submissions
* user-progress

Also added an initialization script with seed data for the first challenge.

## Backend authentication

Added the first authentication backend module for DevJudge.

Implemented:

* user registration
* user login
* user logout
* authenticated session check

Added password hashing with bcrypt.

Added JWT creation and verification.

Added httpOnly cookie authentication using `devjudge_token`.

Added protected route middleware with `requireAuth`.

Added auth input validators for register and login.

## Role based admin permissions

Added role based access control for DevJudge.

Implemented:

* user/admin role separation
* admin role middleware with `requireRole`
* protected admin challenge routes
* create challenge as admin
* update challenge as admin
* delete challenge as admin

Manual tests completed:

* normal user cannot create challenges
* admin can create challenges
* admin can update challenges
* admin can delete challenges

## Frontend Auth Flow and Scalable Structure

### Goal

Build the frontend authentication flow and organize the project with a scalable feature-based structure.

### Branch

`feat/auth-frontend`

### What I built

* Added a scalable frontend folder structure using `features`, `shared`, and `app/routes`.
* Moved auth files into `features/auth`.
* Moved route protection files into `app/routes`.
* Added `AuthContext`, `AuthProvider`, and `useAuth`.
* Fixed the React Fast Refresh warning by separating context, provider, and hook.
* Added frontend session loading using `/auth/me`.
* Added login and register pages.
* Added protected dashboard route.
* Added admin-only route.
* Added basic dashboard and admin home pages.
* Added shared API client functions: `apiGet`, `apiPost`, `apiPut`, and `apiDelete`.

### Important technical decision

I decided not to keep all pages inside `src/pages` because the admin section will grow a lot.

Instead, I moved the frontend to a feature-based structure:

```txt
src/
  app/
    routes/
  features/
    auth/
    admin/
    dashboard/
    home/
  shared/
    api/
```

## Base Layout and Shared UI

### Goal

Create a simple but scalable frontend layout and reusable UI base before adding more feature logic.

### Branch

`feat/base-layout`

### What I built

* Added `AppLayout` for authenticated pages.
* Added `Sidebar` navigation.
* Added `Topbar` with user role and logout action.
* Added shared UI components:

  * `Button`
  * `Input`
  * `Card`
  * `Badge`
  * `LoadingState`
  * `EmptyState`
  * `ErrorState`
* Reused shared UI inside login, register, home, dashboard, and admin pages.
* Added a basic `/challenges` page placeholder for the next challenge listing logic.
* Kept the UI minimal because the priority is still learning structure and behavior before final design.

### Important technical decision

The layout is only used inside protected routes.

Public pages like `/`, `/login`, and `/register` stay outside the dashboard layout.

Authenticated pages like `/dashboard`, `/challenges`, and `/admin` use `AppLayout`.

## Challenges Backend CRUD

### Goal

Build the backend CRUD foundation for DevJudge challenges.

### Branch

`feat/challenges-crud`

### What I built

* Added public challenge routes.
* Added `GET /api/challenges`.
* Added `GET /api/challenges/:slug`.
* Improved admin challenge create, update, and delete logic.
* Added challenge fields:

  * `topic`
  * `language`
  * `function_name`
  * `updated_at`

* Added reusable challenge types.
* Added challenge input validation.
* Added public challenge filters by search, difficulty, topic, and language.
* Updated database schema and seed data.

### Manual tests completed

* Public users can list published challenges.
* Public users can view a published challenge by slug.
* Admin can create a challenge.
* Admin can update a challenge.
* Admin can delete a challenge.
* Normal user cannot create admin challenges.

### Important technical decision

The public challenge module is separated from the admin challenge module.

Public routes only expose published challenges.

Admin routes stay protected with `requireAuth` and `requireRole("admin")`.

## Test cases backend

- Added admin test case backend module.
- Added JSONB fields for challenge inputs and expected outputs.
- Added comparator validation: exact, array_exact, array_unordered, number_tolerance.
- Added admin endpoints to list, create, update, and delete test cases.
- Kept legacy input and expected_output columns for compatibility.
- Manual tested admin CRUD with curl.
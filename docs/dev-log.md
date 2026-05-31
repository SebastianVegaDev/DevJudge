# DevJudge Dev Log

## Initial database schema

Created the first database schema for DevJudge.

Added tables:

- users
- challenges
- test-cases
- submissions
- user-progress

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

- user/admin role separation
- admin role middleware with `requireRole`
- protected admin challenge routes
- create challenge as admin
- update challenge as admin
- delete challenge as admin

Manual tests completed:

- normal user cannot create challenges
- admin can create challenges
- admin can update challenges
- admin can delete challenges
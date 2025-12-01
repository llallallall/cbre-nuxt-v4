# Authentication Instruction

## Overview
This project uses `nuxt-auth-utils` for authentication.
Reference: https://github.com/atinux/nuxt-auth-utils

## Guidelines
1. **Session Management**: Use `useUserSession` composable for managing user sessions.
2. **Login Flow**:
   - Use `$fetch` to call `/api/auth/login`.
   - On success, call `fetch()` from `useUserSession` to refresh the session.
   - Redirect using `navigateTo` or `router.push`.
3. **Middleware**: Ensure `middleware/auth.ts` protects authenticated routes.
4. **Consistency**: Do not use `@sidebase/nuxt-auth` or other auth modules unless explicitly decided. Stick to `nuxt-auth-utils`.

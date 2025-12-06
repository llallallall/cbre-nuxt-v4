# 🛡️ Security & Authentication Standard

This document is the **single source of truth** for all security and authentication practices in the project.

---

## 1. Authentication (Auth)

**Core Module**: `nuxt-auth-utils` (Do not use `@sidebase/nuxt-auth`).

### A. Session Management
- **Composable**: Use `useUserSession()` for checking login state and user data.
- **Login Flow**:
  1. Frontend calls API: `$fetch('/api/auth/login', { method: 'POST', body: ... })`
  2. On success, refreshing session: `const { fetch } = useUserSession(); await fetch();`
  3. Redirect: `navigateTo('/')`

### B. Middleware
- **Protection**: Use `middleware/auth.ts` to protect routes.
- **Logic**: If `!loggedIn`, redirect to `/login`.

### C. Configuration
- **Session config**: Managed via `nuxt.config.ts`, ensuring `secure`, `httpOnly`, and `sameSite` flags are set for production.

---

## 2. Core Security Risks & Application

### A. SQL Injection (Server-Side)
- **Risk**: Malicious SQL input.
- **Defense**:
  - **ORM**: ALWAYS use **Prisma** or **TypeORM**. Never use raw SQL (`$queryRaw`) unless absolutely necessary and parameterized.
  - **Validation**: Use **Zod** to validate all API inputs before passing to DB.

### B. XSS (Client-Side)
- **Risk**: Malicious scripts injecting into DOM.
- **Defense**:
  - **Avoid `v-html`**: Use text interpolation `{{ }}`.
  - **Sanitize**: If `v-html` is required, use **DOMPurify**.
  - **Headers**: `nuxt-security` module handles CSP.

### C. CSRF (Cross-Site Request Forgery)
- **Risk**: Unauthorized actions via authenticated sessions.
- **Defense**:
  - **CSRF Token**: Enable via `nuxt-security`.
  - **SameSite Cookies**: Set to `Lax` or `Strict`.

### D. Sensitive Data Exposure
- **Risk**: Leaking API keys in client bundle.
- **Defense**:
  - **`runtimeConfig`**: Private keys in root, Public keys in `runtimeConfig.public` ONLY.
  - **.env**: Never commit `.env`.

---

## 3. Security Configuration (`nuxt-security`)

We use the `nuxt-security` module for hardening headers.

### A. CSP (Content Security Policy)
Required for external services (Mapbox, Google Maps).

```typescript
// nuxt.config.ts
security: {
  headers: {
    contentSecurityPolicy: {
      "img-src": ["'self'", "data:", "blob:", "https://*.mapbox.com", "https://*.googleapis.com"],
      "script-src": ["'self'", "'unsafe-eval'", "'unsafe-inline'", "https://*.mapbox.com"],
      "connect-src": ["'self'", "https://*.mapbox.com", "https://events.mapbox.com"],
    }
  }
}
```

### B. Checklist
- [ ] `nuxt-security` installed and enabled?
- [ ] CSP headers configured for Mapbox/Google?
- [ ] `runtimeConfig` secrets separated from public?
- [ ] Inputs validated with Zod?

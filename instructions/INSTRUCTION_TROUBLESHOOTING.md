# 🔧 Troubleshooting & Error Resolution Guide

This document is a central repository for known issues, error patterns, and their resolved solutions. Consult this file before debugging.

---

## 1. Hydration Mismatches (Vue/Nuxt)

### **Symptoms**
- Console warning: `[Vue warn]: Hydration node mismatch: - rendered on server: <div> ... - expected on client: Symbol(v-cmt)`
- Elements blinking or changing layout after load.

### **Root Causes**
1.  **Device Detection**: `window` is missing on server.
2.  **Pinia State**: Default state differs from client state.
3.  **Invalid HTML**: Nesting `<a>` inside `<a>` or `p` inside `p`.

### **Solution: "Hydration Gating"**
Use the `isHydrationComplete` pattern to strict-render dynamic components only after mount.

**In `TopBar.vue` / Layouts:**
```typescript
const isHydrationComplete = ref(false)
onMounted(() => {
    isHydrationComplete.value = true
})
```

**In Template:**
```vue
<div v-if="isHydrationComplete">
  <ClientOnly>
    <DynamicComponent />
  </ClientOnly>
</div>
```

---

## 2. Server & Build Errors

### **`html.replace is not a function` (500 Error)**
- **Context**: Occurred during SSR with `nuxt-auth` or `mapbox`.
- **Cause**: Often due to `nuxt-security` or `mapbox` configuration issues affecting the HTML injection pipeline, or syntax errors in `nuxt.config.ts`.
- **Fix**:
    1. Check `nuxt.config.ts` syntax.
    2. Ensure `nuxt-mapbox` is enabled if used.
    3. Verify `routeRules` for auth endpoints.

### **`Recursion detected at /session`**
- **Context**: `@sidebase/nuxt-auth`.
- **Cause**: Auth provider stripping headers or misconfigured `baseURL`.
- **Fix**: Ensure `AUTH_ORIGIN` env var is set and `nuxt.config.ts` auth settings match the provider requirements.

---

## 3. CSS & Tailwind Issues

### **`Cannot apply unknown utility class group`**
- **Cause**: Using structural classes like `group` or `peer` inside `@apply` or `main.css`.
- **Fix**: **NEVER** use `group` in CSS files. Add it directly to the HTML class attribute.
    ```html
    <!-- Good -->
    <div class="group cbre-button">...</div>
    ```

### **Micro-caching / Stale Styles**
- **Issue**: CSS changes in `main.css` not reflecting in Dev Server.
- **Fix**: Force a restart by touching `nuxt.config.ts` (add a space and save).

---

## 4. PDF Viewer Issues

### **CORS Error**
- **Issue**: PDF fails to load from S3/MinIO.
- **Cause**: Server does not allow cross-origin requests from `localhost:3000`.
- **Fix**: Configure CORS on the file server (S3 Bucket Policy) to allow GET requests from your domain.

---

## 5. Security & CSP

### **CSRF Errors**
- **Issue**: API calls blocked by CSRF protection.
- **Fix**: In `nuxt.config.ts`, use `routeRules` to exclude specific API paths if necessary (e.g., `/api/_nuxt_icon/**`), but keep `csrf: true` globally.

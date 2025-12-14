import { defineEventHandler, getRequestURL, createError } from 'h3'
import { getUserSession } from '#imports'

export default defineEventHandler(async (event) => {
    const url = getRequestURL(event);
    const method = event.method;

    // 0. Non-API Routes (Pages, Static Assets, etc.) -> Allow
    // We only want to enforce strict auth on the API layer.
    // Page protection is handled by Client Middleware (middleware/auth.ts).
    if (!url.pathname.startsWith('/api')) {
        return;
    }

    // 1. Global Public Whitelist (Prefixes that are always public)
    const publicPrefixes = [
        '/api/auth',      // Login, Logout, Callback
        '/api/_nuxt_icon', // Iconify
    ];

    if (publicPrefixes.some(p => url.pathname.startsWith(p))) {
        return;
    }

    // 2. Resource-Specific Read-Only Allow List (GET only)
    // These resources are public for reading, but require auth for writing (POST/PUT/DELETE)
    const publicReadPrefixes = [
        '/api/property', // Allows GET /api/property/list, GET /api/property/:id
        '/api/code',     // Common codes
        '/api/search'    // Search functionality
    ];

    if (method === 'GET' && publicReadPrefixes.some(p => url.pathname.startsWith(p))) {
        return; // Allow Public Read
    }

    // 3. Strict Auth Check for Everything Else
    // - /api/user/** (Always private)
    // - POST/PUT/DELETE on Property/Code (Private)
    // - Any other unknown API routes
    const session = await getUserSession(event);

    if (!session.user) {
        // console.warn(`[Auth] 401 Blocked: ${method} ${url.pathname}`); // Log for debugging
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'Login is required.'
        });
    }
});

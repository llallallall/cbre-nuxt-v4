declare module '#auth-utils' {
    interface User {
        id: number | string;
        name: string;
        email: string;
        image?: string;
        role: 'USER' | 'ADMIN' | 'DEVELOPER';
    }

    interface UserSession {
        // Add any session properties if needed
    }
}

export { }

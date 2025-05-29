// types/next-auth.d.ts

import NextAuth from 'next-auth';

// Estende os tipos da Session e User
declare module 'next-auth' {
    interface Session {
        user: {
            name: string;
            email: string;
            image?: string;
            role: string;
            id: string;
        };
    }

    interface User {
        id: string;
        role: string;
    }
}

// Estende o tipo do JWT
declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        name: string;
        email: string;
        role: string;
    }
}

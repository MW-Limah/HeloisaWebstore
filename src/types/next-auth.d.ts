// types/next-auth.d.ts

import NextAuth from 'next-auth';

// Extende os tipos de sessão, usuário e JWT
declare module 'next-auth' {
    interface Session {
        user: {
            name?: string;
            email?: string;
            image?: string;
            role?: string;
            id?: string; // ← adiciona o campo `id`
        };
    }

    interface User {
        id?: string; // ← idem no User
        role?: string;
    }

    interface JWT {
        id?: string; // ← e no JWT
        role?: string;
    }
}

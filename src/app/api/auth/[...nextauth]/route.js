import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Admin Login',
            credentials: {
                username: { label: 'Usuário', type: 'text' },
                password: { label: 'Senha', type: 'password' },
            },
            authorize(credentials) {
                const { username, password } = credentials;

                // Simples exemplo fixo - use banco de dados em produção
                if (username === 'admin' && password === 'admin123') {
                    return { id: '1', name: 'Administrador', role: 'admin' };
                }

                return null;
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }) {
            session.user.role = token.role;
            return session;
        },
        async jwt({ token, user }) {
            if (user) token.role = user.role;
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET, // ou string fixa para teste
});

export { handler as GET, handler as POST };

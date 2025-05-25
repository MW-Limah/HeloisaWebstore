import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '@/app/lib/supabase';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Senha', type: 'password' },
            },
            authorize: async (credentials) => {
                console.log('Credenciais recebidas:', credentials);

                const { email, password } = credentials;

                const { data, error } = await supabase.from('profiles').select('*').eq('email', email).single();

                if (error) {
                    console.error('Erro ao buscar usuário:', error);
                    return null;
                }

                if (!data) {
                    console.log('Usuário não encontrado.');
                    return null;
                }

                if (data.password !== password) {
                    console.log('Senha incorreta.');
                    return null;
                }

                console.log('Login bem-sucedido:', data);

                return {
                    id: data.id,
                    name: data.nome,
                    email: data.email,
                    role: data.role,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token?.role) {
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user?.role) {
                token.role = user.role;
            }
            return token;
        },
    },
    pages: {
        signIn: '/pages/Login',
    },
});

export { handler as GET, handler as POST };

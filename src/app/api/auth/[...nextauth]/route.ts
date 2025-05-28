import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';

const supabaseServer = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // CUIDADO: só use Service Role em ambiente seguro (server-side)
);

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                if (!credentials) return null;

                console.log('Credenciais recebidas:', credentials);

                const { email, password } = credentials;

                const { data: loginData, error: loginError } = await supabaseServer.auth.signInWithPassword({
                    email,
                    password,
                });

                if (loginError || !loginData?.user) {
                    console.error('Erro de login:', loginError?.message);
                    return null;
                }

                const user = loginData.user;

                const { data: profile, error: profileError } = await supabaseServer
                    .from('profiles')
                    .select('id, nome, email, role')
                    .eq('id', user.id)
                    .single();

                if (profileError) {
                    console.error('Erro ao buscar perfil:', profileError.message);
                    return null;
                }

                return {
                    id: profile.id,
                    name: profile.nome,
                    email: profile.email,
                    role: profile.role,
                };
            },
        }),
    ],
    pages: {
        signIn: '/pages/Login',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

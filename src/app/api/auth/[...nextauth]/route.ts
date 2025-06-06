// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';

// Cliente admin (service role) — só no server!
const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Senha', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null;

                // 1) autentica no Supabase Auth
                const { data: loginData, error: loginError } = await supabaseAdmin.auth.signInWithPassword({
                    email: credentials.email,
                    password: credentials.password,
                });
                if (loginError || !loginData.user) {
                    console.error('Erro de login:', loginError?.message);
                    return null;
                }

                // 2) busca perfil no Postgres via client admin
                const { data: profile, error: profileError } = await supabaseAdmin
                    .from('profiles')
                    .select('id, nome, email, role')
                    .eq('id', loginData.user.id)
                    .single(); // garante que só retorna um registro ou erro

                if (profileError || !profile) {
                    console.error('Erro ao buscar perfil:', profileError?.message);
                    return null;
                }

                // 3) devolve um "user" simples para o NextAuth
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
        // rota do seu formulário de login no App Router
        signIn: '/login',
    },

    session: {
        strategy: 'jwt',
    },

    callbacks: {
        // Sempre que gerar/atualizar o JWT
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = user.role;
            }
            return token;
        },

        // Quando retornar ao cliente a sessão
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

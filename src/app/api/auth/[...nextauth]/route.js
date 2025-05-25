// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '@/app/lib/supabase';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Admin Login',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Senha', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('E-mail e senha são obrigatórios');
                }

                // 1) Autentica usuário
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: credentials.email,
                    password: credentials.password,
                });
                if (error || !data.user) {
                    console.error('Login falhou:', error?.message);
                    return null;
                }

                // 2) Verifica role no perfil via cliente admin
                const { data: profile, error: profileErr } = await supabaseAdmin
                    .from('profiles')
                    .select('role, nome')
                    .eq('id', data.user.id)
                    .single();
                if (profileErr) {
                    console.error('Erro ao buscar perfil:', profileErr.message);
                    return null;
                }

                if (profile.role !== 'admin') {
                    console.warn('Acesso negado para usuário não-admin:', data.user.id);
                    return null;
                }

                // 3) Retorna dados para sessão
                return {
                    id: data.user.id,
                    name: profile.nome,
                    email: data.user.email,
                    role: profile.role,
                };
            },
        }),
    ],

    pages: {
        signIn: '/login',
    },

    session: {
        strategy: 'jwt',
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role;
                session.user.name = token.name;
            }
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

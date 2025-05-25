'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // 1) Pega o token do fragmento da URL (window.location.hash)
    useEffect(() => {
        // Exemplo: "#access_token=abc123&refresh_token=xyz..."
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const t = params.get('access_token');
            if (t) setToken(t);
        }
    }, []);

    // 2) Cria o supabase com header Authorization se tivermos token
    const supabaseAuth = token
        ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
              global: {
                  headers: { Authorization: `Bearer ${token}` },
              },
          })
        : null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!supabaseAuth) {
            setMsg('Token de reset ausente ou inválido');
            return;
        }

        setLoading(true);
        const { error } = await supabaseAuth.auth.updateUser({ password });
        if (error) {
            setMsg(error.message);
        } else {
            setMsg('Senha atualizada com sucesso! Redirecionando…');
            setTimeout(() => router.push('/login'), 2000);
        }
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Nova senha</h1>
            <input
                type="password"
                placeholder="Digite a nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border p-2 rounded"
            />
            <button
                type="submit"
                disabled={!token || loading}
                className="bg-green-600 text-white p-2 rounded disabled:opacity-50"
            >
                {loading ? 'Salvando…' : 'Atualizar senha'}
            </button>
            {msg && <p className="text-sm text-gray-700">{msg}</p>}
        </form>
    );
}

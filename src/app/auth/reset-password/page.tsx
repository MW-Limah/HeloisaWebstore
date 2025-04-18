'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const recoverSession = async () => {
            if (window.location.hash) {
                const { error } = await supabase.auth.exchangeCodeForSession(window.location.hash);
                if (error) {
                    setMsg('Erro ao recuperar sessão: ' + error.message);
                }
            }
        };
        recoverSession();
    }, []);

    async function handleReset(e: React.FormEvent) {
        e.preventDefault();

        if (password.length < 6) {
            setMsg('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setMsg(`Erro ao atualizar a senha: ${error.message}`);
        } else {
            setMsg('Senha atualizada com sucesso!');
            setTimeout(() => router.push('/pages/Login'), 2000);
        }

        setIsLoading(false);
    }

    return (
        <form onSubmit={handleReset} className="flex flex-col gap-4 max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold">Nova senha</h1>
            <input
                type="password"
                placeholder="Nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border p-2 rounded"
            />
            <button
                type="submit"
                className={`bg-green-600 text-white px-4 py-2 rounded ${isLoading ? 'opacity-50' : ''}`}
                disabled={isLoading}
            >
                {isLoading ? 'Atualizando...' : 'Atualizar senha'}
            </button>
            {msg && <p className="text-sm text-gray-700">{msg}</p>}
        </form>
    );
}

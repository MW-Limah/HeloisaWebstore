// app/auth/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { sendPasswordReset } from '../../actions/send-reset';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Para gerenciar o estado de carregamento

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true); // Ativa o estado de carregamento
        try {
            const result = await sendPasswordReset(email);
            setMsg(result);
        } catch (err: any) {
            setMsg('Erro ao enviar o e-mail de recuperação. Tente novamente mais tarde.');
        } finally {
            setIsLoading(false); // Desativa o estado de carregamento
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold">Recuperar senha</h1>
            <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border p-2 rounded"
            />
            <button
                type="submit"
                className={`bg-blue-600 text-white px-4 py-2 rounded ${isLoading ? 'opacity-50' : ''}`}
                disabled={isLoading}
            >
                {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
            {msg && <p className="text-sm text-gray-700">{msg}</p>}
        </form>
    );
}

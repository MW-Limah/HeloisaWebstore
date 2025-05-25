'use client';

import { useState } from 'react';
import { sendPasswordReset } from '../../actions/send-reset';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await sendPasswordReset(email);
            setMsg(result);
        } catch (err: any) {
            setMsg(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Recuperar senha</h1>
            <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border p-2 rounded"
            />
            <button type="submit" disabled={loading} className="bg-blue-600 text-white p-2 rounded disabled:opacity-50">
                {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
            {msg && <p className="text-sm text-gray-700">{msg}</p>}
        </form>
    );
}

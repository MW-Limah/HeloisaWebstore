// app/admin/cadastro/page.tsx (ou onde seu formulário esteja)
'use client';

import { useState } from 'react';

export default function CadastroAdm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nome, setNome] = useState('');
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, nome }),
        });

        const json = await res.json();
        if (!res.ok) {
            console.error('register error:', json);
            setError(json.error || 'Erro desconhecido');
            return;
        }

        // sucesso!
        alert('Administrador cadastrado com sucesso.');
        setEmail('');
        setPassword('');
        setNome('');
    }
    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-2xl mb-4">Cadastrar novo Administrador</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500">{error}</p>}
                <div>
                    <label className="block font-medium">Nome</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium">E-mail</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium">Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Cadastrar novo adm
                </button>
            </form>
        </div>
    );
}

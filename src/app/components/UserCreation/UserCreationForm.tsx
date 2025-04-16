// src/components/UserCreationForm.tsx
'use client';

import { useState } from 'react';

type StatusType = {
    type: 'success' | 'error';
    message: string;
} | null;

export default function UserCreationForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nome: '',
        role: 'user',
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<StatusType>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            console.log('Enviando dados:', formData);
            const res = await fetch('/api/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            console.log('Resposta da API:', data);

            if (!res.ok) {
                // Log completo do erro no console
                console.error('Erro na API:', data.error);
                throw new Error(data.error || 'Erro desconhecido ao criar usuário.');
            }

            setStatus({ type: 'success', message: data.message });
            setFormData({ email: '', password: '', nome: '', role: 'user' });
        } catch (error: any) {
            console.error('Erro na criação do usuário:', error);
            setStatus({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-2xl font-semibold text-center">Criar Novo Usuário</h2>

            <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
            />

            <input
                type="password"
                name="password"
                placeholder="Senha"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
            />

            <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
            />

            <select name="role" value={formData.role} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
                <option value="editor">Editor</option>
            </select>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
                {loading ? 'Criando...' : 'Criar Usuário'}
            </button>

            {status && (
                <div
                    className={`p-2 rounded text-center ${
                        status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                >
                    {status.message}
                </div>
            )}
        </form>
    );
}

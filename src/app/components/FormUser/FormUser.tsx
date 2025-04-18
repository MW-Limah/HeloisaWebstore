'use client';
import { useState } from 'react';

export default function SignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nome, setNome] = useState('');
    const [role, setRole] = useState('user');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, nome, role }),
        });

        const data = await res.json();
        if (res.ok) {
            alert('Usuário criado com sucesso!');
        } else {
            alert('Erro: ' + data.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />
            <button type="submit">Cadastrar</button>
        </form>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Cadastro.module.css';
import ButtonBack from '@/app/components/buttonBack/buttonBack';

export default function Cadastro() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');
    const [role, setRole] = useState('admin'); // ou 'user'
    const [msg, setMsg] = useState('');

    const handleCadastro = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password: senha, nome, role }),
        });

        const result = await res.json();

        if (res.ok) {
            setMsg('Usuário cadastrado com sucesso!');
            setTimeout(() => router.push('/'), 2000); // redireciona para login
        } else {
            setMsg(result.error || 'Erro ao cadastrar usuário');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.buttonBack}>
                <ButtonBack />
            </div>

            <form onSubmit={handleCadastro} className={styles.form}>
                <h4>Cadastro de Usuário</h4>
                <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="user">Usuário</option>
                </select>
                <button type="submit">Cadastrar</button>
                {msg && <p className={styles.msg}>{msg}</p>}
            </form>
        </div>
    );
}

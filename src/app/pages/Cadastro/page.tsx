// app/admin/cadastro/page.tsx
'use client';

import { useState } from 'react';
import styles from './singUp.module.css';
import ButtonBack from '@/app/components/buttonBack/buttonBack';

export default function CadastroUsuario() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nome, setNome] = useState('');
    const [role, setRole] = useState<'admin' | 'client'>('client');
    const [adminKey, setAdminKey] = useState('');
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        // Verifica se está tentando cadastrar admin sem a senha mestra
        if (role === 'admin' && adminKey !== process.env.NEXT_PUBLIC_ADMIN_KEY) {
            setError('Senha de administrador incorreta');
            return;
        }

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, nome, role }),
        });

        const json = await res.json();
        if (!res.ok) {
            console.error('register error:', json);
            setError(json.error || 'Erro desconhecido');
            return;
        }

        alert(`Usuário ${role === 'admin' ? 'administrador' : 'comum'} cadastrado com sucesso.`);
        setEmail('');
        setPassword('');
        setNome('');
        setAdminKey('');
        setRole('client');
    }

    return (
        <div className={styles.container}>
            <div className={styles.buttonBack}>
                <ButtonBack />
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h1>Cadastrar Novo Usuário</h1>
                {error && <p className={styles.error}>{error}</p>}

                <label className={styles.label}>Nome</label>
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className={styles.input}
                />

                <label className={styles.label}>E-mail</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles.input}
                />

                <label className={styles.label}>Senha</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={styles.input}
                />

                <label className={styles.label}>Tipo de Usuário</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'client')}
                    className={styles.input}
                >
                    <option value="client">Usuário</option>
                    <option value="admin">Gerente</option>
                </select>

                {role === 'admin' && (
                    <>
                        <label className={styles.label}>Senha Mestra para Administrador</label>
                        <input
                            type="password"
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </>
                )}
                <button type="submit" className={styles.btnSignUp}>
                    Cadastrar
                </button>
            </form>
        </div>
    );
}

'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './LoginAdmin.module.css';

export default function LoginAdmin() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password: senha,
        });

        if (res.ok) {
            router.push('/pages/Admin');
        } else {
            alert('Usuário ou senha incorretos!');
            router.push('/');
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleLogin} className={styles.form}>
                <input type="text" placeholder="Usuário" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

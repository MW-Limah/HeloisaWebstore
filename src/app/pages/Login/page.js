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
                <h4>Admin</h4>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                <h4>Senha</h4>
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
                <button type="submit">Entre</button>
            </form>
        </div>
    );
}

'use client';
import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import styles from './login.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    async function handleSignIn() {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
    }

    async function handleSignUp() {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setError(error.message);
    }
    return (
        <div className={styles.content}>
            <h1 className="text-2xl mb-4">Entrar / Cadastrar</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.email}
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.password}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button onClick={handleSignIn} className={styles.btnEnter}>
                Entrar
            </button>
            <button onClick={handleSignUp} className={styles.btnSign}>
                Cadastrar
            </button>
        </div>
    );
}

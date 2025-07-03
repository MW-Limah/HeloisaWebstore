'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import styles from './reset.module.css';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const t = params.get('access_token');
            if (t) setToken(t);
        }
    }, []);

    const supabaseAuth = token
        ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
              global: {
                  headers: { Authorization: `Bearer ${token}` },
              },
          })
        : null;

    useEffect(() => {
        if (confirmPassword && password !== confirmPassword) {
            setPasswordMatchError('As senhas não coincidem');
        } else {
            setPasswordMatchError('');
        }
    }, [password, confirmPassword]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!supabaseAuth) {
            setMsg('Token de reset ausente ou inválido');
            return;
        }
        if (password !== confirmPassword) {
            setPasswordMatchError('As senhas não coincidem');
            return;
        }

        setLoading(true);
        const { error } = await supabaseAuth.auth.updateUser({ password });
        if (error) {
            setMsg(error.message);
        } else {
            setMsg('Senha atualizada com sucesso! Redirecionando…');
            setTimeout(() => router.push('/pages/Login'), 2000);
        }
        setLoading(false);
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h1 className={styles.newpass}>Atualize sua senha</h1>
                <div className={styles.passwordField}>
                    <div className={styles.inputWrapper}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Digite a nova senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.digit}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={styles.eyeBtn}
                            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                    </div>

                    <div className={styles.inputWrapper}>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirme a nova senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className={styles.digit}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className={styles.eyeBtn}
                            aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                            {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                    </div>

                    {passwordMatchError && (
                        <p className={styles.msg} style={{ color: 'red' }}>
                            {passwordMatchError}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={!token || loading || password !== confirmPassword}
                        className={styles.btnsave}
                    >
                        {loading ? 'Salvando…' : 'Atualizar senha'}
                    </button>
                    {msg && <p className={styles.msg}>{msg}</p>}
                </div>
            </form>
        </div>
    );
}

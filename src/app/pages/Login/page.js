'use client';

import { supabase } from '@/app/lib/supabase'; // ← aqui
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sendPasswordReset } from '@/app/api/actions/send-reset';
import styles from './LoginAdmin.module.css';
import ButtonBack from '@/app/components/buttonBack/buttonBack';

export default function LoginAdmin() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [forgotMode, setForgotMode] = useState(false);
    const [msg, setMsg] = useState('');
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role) {
            if (session.user.role === 'admin') {
                router.push('/pages/Admin');
            } else {
                router.push('/perfil');
            }
        }
    }, [status, session, router]);

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password: senha,
        });

        if (res.ok) {
            // ⚠️ Espera sessão atualizar
            const { data: authData, error: authError } = await supabase.auth.getUser();

            if (authError || !authData.user) {
                console.error('Erro ao obter usuário autenticado:', authError?.message);
                return;
            }

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', authData.user.id)
                .single();

            if (profileError) {
                console.error('Erro ao buscar perfil:', profileError.message);
                return;
            }
        } else {
            alert('Usuário ou senha incorretos!');
            router.push('/pages/Login');
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        try {
            const result = await sendPasswordReset(email);
            setMsg(result);
        } catch (err) {
            setMsg(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.buttonBack}>
                <ButtonBack />
            </div>

            {!forgotMode ? (
                <form onSubmit={handleLogin} className={styles.form}>
                    <h4>Usuário</h4>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <h4>Senha</h4>
                    <input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                    <div className={styles.buttonContainer}>
                        <button type="submit">Entrar</button>
                        <button type="button" className={styles.link} onClick={() => router.push('/pages/Cadastro')}>
                            Cadastrar
                        </button>
                        <button
                            type="button"
                            className={styles.link}
                            onClick={() => {
                                setForgotMode(true);
                                setMsg('');
                            }}
                        >
                            Esqueci minha senha
                        </button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleForgotPassword} className={styles.form}>
                    <h4>Recuperar senha</h4>
                    <input
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Enviar link de recuperação</button>
                    <button
                        type="button"
                        className={styles.link}
                        onClick={() => {
                            setForgotMode(false);
                            setMsg('');
                        }}
                    >
                        Voltar para login
                    </button>
                    {msg && <p className={styles.msg}>{msg}</p>}
                </form>
            )}
        </div>
    );
}

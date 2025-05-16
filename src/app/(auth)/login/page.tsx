'use client';
import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import styles from './login.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState<string | null>(null);

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
    }

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });

        if (signUpError) {
            setError(signUpError.message);
            return;
        }

        const user = signUpData.user;
        if (!user) {
            setError('Erro ao obter o usuário após o cadastro.');
            return;
        }

        // Criação do perfil do cliente na tabela `clients`
        const { error: insertError } = await supabase.from('clients').insert({
            id: user.id,
            first_name: firstName,
            last_name: lastName,
            phone,
            email,
        });

        if (insertError) {
            setError('Erro ao criar o perfil do cliente: ' + insertError.message);
        }
    }

    return (
        <div className={styles.content}>
            <form className={styles.form}>
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

                {/* Campos extras */}
                <input
                    type="text"
                    placeholder="Nome"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={styles.name}
                />
                <input
                    type="text"
                    placeholder="Sobrenome"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={styles.name}
                />
                <input
                    type="text"
                    placeholder="Telefone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={styles.phone}
                />

                {error && <p className={styles.error}>{error}</p>}

                <button onClick={handleSignIn} className={styles.btnEnter}>
                    Entrar
                </button>
                <button onClick={handleSignUp} className={styles.btnSign}>
                    Cadastrar
                </button>
            </form>
        </div>
    );
}

'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from './perfil.module.css';
import ButtonBack from '@/app/components/buttonBack/buttonBack';

export default function PerfilPage() {
    const [userData, setUserData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchProfile() {
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push('/');
                return;
            }

            const { data, error } = await supabase.from('clients').select('*').eq('id', user.id).single();

            if (error) {
                setError(error.message);
            } else {
                setUserData(data);
            }
        }

        fetchProfile();
    }, []);

    if (!userData) {
        return <p className={styles.loading}>Carregando...</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1>Meu Perfil</h1>
                <div className={styles.profileBox}>
                    <p>
                        <strong>Nome:</strong> {userData.first_name}
                    </p>
                    <p>
                        <strong>Sobrenome:</strong> {userData.last_name}
                    </p>
                    <p>
                        <strong>Email:</strong> {userData.email}
                    </p>
                    <p>
                        <strong>Telefone:</strong> {userData.phone}
                    </p>
                    <p>
                        <strong>ID do Usuário:</strong> {userData.id}
                    </p>
                </div>
            </div>
        </div>
    );
}

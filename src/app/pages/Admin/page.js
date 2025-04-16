'use client';

import { useSession, signOut } from 'next-auth/react';
import styles from './Admin.module.css';
import Form from './form/form'; /* 
import UserCreationForm from '@/app/components/UserCreation/UserCreationForm'; */

export default function AdminPage() {
    const { data: session, status } = useSession();

    if (status === 'loading') return <p>Carregando...</p>;

    if (!session) return <p>Você não está autenticado.</p>;

    return (
        <main className={styles.container}>
            <h1>Bem-vindo, {session.user.name}</h1>
            <button onClick={() => signOut()}>Sair</button>
            <div className={styles.containerForm}>
                <Form />
                {/* <UserCreationForm /> */}
            </div>
        </main>
    );
}

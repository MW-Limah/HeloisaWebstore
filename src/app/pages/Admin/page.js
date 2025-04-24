'use client';

import { useSession, signOut } from 'next-auth/react';
import styles from './Admin.module.css';
import Form from './form/form';
import ButtonBack from '@/app/components/buttonBack/buttonBack';
import Link from 'next/link';
import { TbArrowBackUp } from 'react-icons/tb';

export default function AdminPage() {
    const { data: session, status } = useSession();

    if (status === 'loading') return <p>Carregando...</p>;

    if (!session)
        return (
            <div className={styles.notAuth}>
                <p className={styles.pOut}>Você não está autenticado {':('}</p>

                <div className={styles.buttonBack}>
                    <ButtonBack />
                </div>
            </div>
        );

    return (
        <main className={styles.container}>
            <div className={styles.formHeader}>
                <div className={styles.buttonContainer}>
                    <div className={styles.buttonBack}>
                        <ButtonBack />
                    </div>

                    <button className={styles.buttonOut} onClick={() => signOut()}>
                        Sair <TbArrowBackUp className={styles.back} />
                    </button>
                </div>
                <h1>Bem-vindo, {session.user.name} </h1>
            </div>
            <div className={styles.containerForm}>
                <Form />
            </div>
        </main>
    );
}

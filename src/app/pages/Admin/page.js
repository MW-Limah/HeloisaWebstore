'use client';

import { useSession, signOut } from 'next-auth/react';
import styles from './Admin.module.css';
import Form from './form/form';
import { TbArrowBackUp } from 'react-icons/tb';
import Link from 'next/link';

export default function AdminPage() {
    const { data: session, status } = useSession();

    if (status === 'loading') return <p>Carregando...</p>;

    if (!session)
        return (
            <div className={styles.notAuth}>
                <p className={styles.pOut}>Você não está autenticado {':('}</p>
                <button>
                    <Link href={'/'}>
                        Voltar <TbArrowBackUp />
                    </Link>
                </button>
            </div>
        );

    return (
        <main className={styles.container}>
            <div className={styles.formHeader}>
                <div className={styles.buttonContainer}>
                    <button className={styles.buttonBack}>
                        <Link href={'/'}>
                            Voltar a tela incial
                            <TbArrowBackUp />
                        </Link>
                    </button>
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

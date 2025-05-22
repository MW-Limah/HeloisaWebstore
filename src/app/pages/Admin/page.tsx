'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import styles from './Admin.module.css';
import Form from './form/form';
import ButtonBackAll from '@/app/components/buttonBackAll/buttonBack';
import Loading from '@/app/components/Loading/Loading';
import { TbArrowBackUp } from 'react-icons/tb';

export default function AdminPage() {
    const { data: session, status } = useSession();
    const [deleteId, setDeleteId] = useState('');
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    async function handleDelete(e: React.FormEvent) {
        e.preventDefault();
        setDeleteError(null);
        setDeleteSuccess(false);

        const res = await fetch('/api/delete-user', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: deleteId.trim() }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
            setDeleteSuccess(true);
            setDeleteId('');
        } else {
            setDeleteError(data.error || 'Falha desconhecida');
        }
    }

    if (status === 'loading') return <Loading />;

    if (!session)
        return (
            <div className={styles.notAuth}>
                <p className={styles.pOut}>Você não está autenticado {':('}</p>
                <div className={styles.buttonBack}>
                    <ButtonBackAll />
                </div>
            </div>
        );

    return (
        <main className={styles.container}>
            <div className={styles.formHeader}>
                <div className={styles.buttonContainer}>
                    <div className={styles.buttonBack}>
                        <ButtonBackAll />
                    </div>
                    <button className={styles.buttonOut} onClick={() => signOut()}>
                        Sair <TbArrowBackUp className={styles.back} />
                    </button>
                </div>
                <h1>Bem-vindo, {session.user?.name}</h1>
            </div>

            <div className={styles.containerForm}>
                <Form />
            </div>

            <div className={styles.containerForm}>
                <h2>Deletar usuário</h2>
                <form onSubmit={handleDelete} className={styles.deleteForm}>
                    <label htmlFor="deleteId">ID do usuário:</label>
                    <input
                        id="deleteId"
                        type="text"
                        value={deleteId}
                        onChange={(e) => setDeleteId(e.target.value)}
                        placeholder="uuid do usuário"
                        required
                    />
                    <button type="submit" className={styles.btnDelete}>
                        Apagar
                    </button>
                </form>
                {deleteError && <p className={styles.error}>{deleteError}</p>}
                {deleteSuccess && <p className={styles.success}>Usuário apagado com sucesso!</p>}
            </div>
        </main>
    );
}

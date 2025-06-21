'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import Form from './form/form';
import ButtonBackAll from '@/app/components/buttonBackAll/buttonBack';
import Loading from '@/app/components/Loading/Loading';
import { TbArrowBackUp } from 'react-icons/tb';
import { supabase } from '@/app/lib/supabase';

interface BoxItemData {
    id: string;
    title: string;
    images: string[];
    description: string;
    theme: string;
    price: string;
}

export default function AdminPage() {
    const { data: session, status } = useSession();
    const [items, setItems] = useState<BoxItemData[]>([]);
    const [itemsError, setItemsError] = useState<string | null>(null);
    const [loadingItems, setLoadingItems] = useState<boolean>(true);

    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [deleteItemError, setDeleteItemError] = useState<string | null>(null);
    const [deleteItemSuccess, setDeleteItemSuccess] = useState<string | null>(null);

    const [showConfirmPopup, setShowConfirmPopup] = useState(false);

    async function handleDeleteItemConfirmed() {
        if (!selectedItemId) return;

        setDeleteItemError(null);
        setDeleteItemSuccess(null);

        try {
            const { error } = await supabase.from('box-items').delete().eq('id', selectedItemId);
            if (error) throw error;

            setDeleteItemSuccess('Item deletado com sucesso!');
            setItems((prev) => prev.filter((item) => item.id !== selectedItemId));
            setSelectedItemId(null);
        } catch (err: any) {
            console.error('Erro ao deletar item:', err.message);
            setDeleteItemError('Erro ao deletar item.');
        } finally {
            setShowConfirmPopup(false);
        }
    }

    useEffect(() => {
        async function fetchItems() {
            setLoadingItems(true);
            setItemsError(null);
            try {
                const { data, error } = await supabase
                    .from('box-items')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const parsedData = (data as BoxItemData[]).map((item) => ({
                    ...item,
                    price: parseFloat(item.price.replace(',', '.')).toFixed(2),
                }));

                setItems(parsedData);
            } catch (err: any) {
                console.error('Erro ao buscar itens:', err.message);
                setItemsError('Não foi possível carregar os itens.');
            } finally {
                setLoadingItems(false);
            }
        }

        fetchItems();
    }, []);

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
                <h2>Itens cadastrados</h2>
                {loadingItems && <Loading />}
                {itemsError && <p className={styles.error}>{itemsError}</p>}
                {!loadingItems && !itemsError && items.length === 0 && (
                    <p className={styles.info}>Nenhum item cadastrado encontrado.</p>
                )}
                {!loadingItems && items.length > 0 && (
                    <>
                        <ul className={styles.itemList}>
                            {items.map((item) => (
                                <li
                                    key={item.id}
                                    className={`${styles.item} ${
                                        selectedItemId === item.id ? styles.selectedItem : ''
                                    }`}
                                    onClick={() => setSelectedItemId(item.id)}
                                >
                                    <strong>{item.title}</strong> — {item.theme} — R$
                                    {Number(item.price).toLocaleString('pt-BR', {
                                        minimumFractionDigits: 2,
                                    })}
                                </li>
                            ))}
                        </ul>
                        {selectedItemId && (
                            <div className={styles.deleteItemContainer}>
                                <p>
                                    Item selecionado:{' '}
                                    <strong>
                                        {items.find((item) => item.id === selectedItemId)?.title || 'Desconhecido'}
                                    </strong>
                                </p>
                                <button className={styles.btnDelete} onClick={() => setShowConfirmPopup(true)}>
                                    Deletar item selecionado
                                </button>
                                {deleteItemError && <p className={styles.error}>{deleteItemError}</p>}
                                {deleteItemSuccess && <p className={styles.success}>{deleteItemSuccess}</p>}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Popup de confirmação */}
            {showConfirmPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <p>
                            Tem certeza que deseja deletar o item{' '}
                            <strong>{items.find((item) => item.id === selectedItemId)?.title || 'Desconhecido'}</strong>
                            ?
                        </p>
                        <div className={styles.popupButtons}>
                            <button className={styles.btnDelete} onClick={handleDeleteItemConfirmed}>
                                Sim, deletar
                            </button>
                            <button className={styles.btnCancel} onClick={() => setShowConfirmPopup(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

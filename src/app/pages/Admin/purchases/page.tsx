'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/app/lib/supabase';
import styles from './requests.module.css';
import ButtonBack from '@/app/components/buttonBack/buttonBack';
import Loading from '@/app/components/Loading/Loading';
import Link from 'next/link';

interface Receipt {
    id: string;
    created_at: string;
    items: any[];
    total: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    cep: string;
    bairro: string;
    rua: string;
    numero: string;
}

export default function RequestsPanel() {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchReceipts = async () => {
            const { data, error } = await supabase
                .from('receipts')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error) setReceipts(data);
        };

        if (session?.accessToken) {
            supabase.auth
                .setSession({
                    access_token: session.accessToken,
                    refresh_token: session.refreshToken ?? '',
                })
                .then(() => {
                    fetchReceipts();
                });
        }
    }, [session]);

    useEffect(() => {
        const fetchReceipts = async () => {
            const { data, error } = await supabase
                .from('receipts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Erro ao buscar recibos:', error.message);
                return;
            }

            const parsedReceipts = data.map((receipt: any) => ({
                ...receipt,
                items: typeof receipt.items === 'string' ? JSON.parse(receipt.items) : receipt.items,
            }));

            setReceipts(parsedReceipts);
        };

        if (session?.user?.role === 'admin') {
            fetchReceipts();
        }
    }, [session]);

    if (status === 'loading') return <Loading />;

    console.log('User ID:', session?.user?.id);

    if (!session)
        return (
            <div className={styles.notAuth}>
                <p className={styles.pOut}>Você não está autenticado {':('}</p>
                <Link href={'/login'} className={styles.buttonBack}>
                    Voltar ao login
                </Link>
            </div>
        );

    if (session.user.role !== 'admin') {
        return (
            <div className={styles.notAuth}>
                <p className={styles.pOut}>Acesso restrito. Apenas administradores podem visualizar essa página.</p>
                <Link href={'/'} className={styles.buttonBack}>
                    Voltar ao início
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <ButtonBack />
            <div className={styles.content}>
                <h2>Painel de Solicitações</h2>
                <div className={styles.shoppings}>
                    <h3>Recibos de compras</h3>
                    <div className={styles.requests}>
                        {receipts.map((receipt) => (
                            <div key={receipt.id} className={styles.requestCard}>
                                <div>
                                    <h4>Informações do produto</h4>
                                    {receipt.items?.map((item: any, i: number) => (
                                        <div key={i}>
                                            <div>
                                                <strong>Produto:</strong> {item.title}
                                            </div>
                                            <div>
                                                <strong>ID:</strong> {item.id}
                                            </div>
                                            <div>
                                                <strong>Qtd.:</strong> {item.quantity}
                                            </div>
                                            <div>
                                                <strong>Cor:</strong> {item.color}
                                            </div>
                                            <div>
                                                <strong>Preço:</strong> R$ {item.price}
                                            </div>
                                        </div>
                                    ))}
                                    <div>
                                        <strong>Total:</strong> R$ {receipt.total}
                                    </div>
                                </div>
                                <div>
                                    <h4>Cliente</h4>
                                    <div>
                                        <strong>Nome:</strong> {receipt.customer_name}
                                    </div>
                                    <div>
                                        <strong>Email:</strong> {receipt.customer_email}
                                    </div>
                                    <div>
                                        <strong>Telefone:</strong> {receipt.customer_phone}
                                    </div>
                                </div>
                                <div>
                                    <h4>Endereço</h4>
                                    <div>
                                        <strong>CEP:</strong> {receipt.cep}
                                    </div>
                                    <div>
                                        <strong>Bairro:</strong> {receipt.bairro}
                                    </div>
                                    <div>
                                        <strong>Rua:</strong> {receipt.rua}
                                    </div>
                                    <div>
                                        <strong>Número:</strong> {receipt.numero}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {receipts.length === 0 && <p>Nenhum recibo encontrado.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

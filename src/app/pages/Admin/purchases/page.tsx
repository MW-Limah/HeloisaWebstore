'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/app/lib/supabase';
import styles from './requests.module.css';
import ButtonBack from '@/app/components/buttonBack/buttonBack';
import Loading from '@/app/components/Loading/Loading';
import Link from 'next/link';
import Image from 'next/image';

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
            <div className={styles.header}>
                <ButtonBack />
            </div>
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
                                            <ul>
                                                <li>
                                                    <label>Produto:</label>
                                                    <div className={styles.detail}>{item.title}</div>
                                                </li>
                                                <li>
                                                    <label>Código:</label>
                                                    <div className={styles.detail}>{item.id}</div>
                                                </li>
                                                <li>
                                                    <label>Quantidade: </label>
                                                    <div className={styles.detail}>{item.quantity}</div>
                                                </li>
                                                <li>
                                                    <label>Cor: </label>
                                                    <div className={styles.detail}>{item.color}</div>
                                                </li>
                                                <li>
                                                    <label>Preço: </label>
                                                    <div className={styles.detail}>R$ {item.price}</div>
                                                </li>
                                            </ul>
                                            <div className={styles.ImageContainer}>
                                                <div className={styles.imageWrapper}>
                                                    <label>Imagem</label>
                                                    <Image
                                                        className={styles.Img}
                                                        src={item.image}
                                                        width={150}
                                                        height={180}
                                                        alt={item.title}
                                                    ></Image>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className={styles.Total}>
                                        <label>Total (Valor +Taxa):</label>
                                        <div className={styles.TotalValue}>R$ {receipt.total}</div>
                                    </div>
                                </div>
                                <div>
                                    <h4>Cliente</h4>
                                    <ul>
                                        <li>
                                            <label>Nome:</label>
                                            <div className={styles.detail}>{receipt.customer_name}</div>
                                        </li>
                                        <li>
                                            <label>Email:</label>
                                            <div className={styles.detail}>{receipt.customer_email}</div>
                                        </li>
                                        <li>
                                            <label>Telefone:</label>
                                            <div className={styles.detail}>{receipt.customer_phone}</div>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4>Endereço</h4>
                                    <ul>
                                        <li>
                                            <label>CEP:</label>
                                            <div className={styles.detail}>{receipt.cep}</div>
                                        </li>
                                        <li>
                                            <label>Bairro:</label>
                                            <div className={styles.detail}>{receipt.bairro}</div>
                                        </li>
                                        <li>
                                            <label>Rua:</label>
                                            <div className={styles.detail}>{receipt.rua}</div>
                                        </li>
                                        <li>
                                            <label>Número:</label>
                                            <div className={styles.detail}>{receipt.numero}</div>
                                        </li>
                                    </ul>
                                    <div className={styles.date}>
                                        <h4>Data: {receipt.created_at}</h4>
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

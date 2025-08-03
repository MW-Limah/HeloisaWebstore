'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import styles from './requests.module.css';

export default function RequestsPanel() {
    const [receipts, setReceipts] = useState<any[]>([]);

    useEffect(() => {
        const fetchReceipts = async () => {
            const { data, error } = await supabase
                .from('receipts')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error) setReceipts(data);
        };
        fetchReceipts();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2>Painel de Solicitações</h2>
                <div className={styles.shoppings}>
                    <h3>Solicitações de compras</h3>
                    <div className={styles.requests}>
                        {receipts.map((receipt) => (
                            <div key={receipt.id} className={styles.requestCard}>
                                <div>
                                    <h4>Informações do produto</h4>
                                    {receipt.items.map((item: any, i: number) => (
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
                    </div>
                </div>
            </div>
        </div>
    );
}

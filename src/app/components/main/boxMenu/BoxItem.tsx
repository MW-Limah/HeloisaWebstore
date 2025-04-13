'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import styles from './boxMenu.module.css';
import Image from 'next/image';

interface BoxItemData {
    id: string;
    title: string;
    images: string[];
    description: string;
    theme: string;
    price: string;
}

export default function BoxItem() {
    const [items, setItems] = useState<BoxItemData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchItems() {
            setLoading(true);
            const { data, error } = await supabase
                .from('box-items')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Erro ao buscar itens:', error);
                setError(error.message);
            } else {
                setItems(data as BoxItemData[]);
            }
            setLoading(false);
        }

        fetchItems();
    }, []);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro ao carregar os itens: {error}</p>;

    return (
        <section>
            {items.map((item) => (
                <article key={item.id} className={styles.boxContent}>
                    <div className={styles.boxMenutitle}>
                        <h2>{item.title}</h2>
                    </div>

                    <div className={styles.boxMenu}>
                        {item.images.slice(0, 4).map((imgUrl, index) => (
                            <div key={`${item.id}-${index}`} className={styles.boxItem}>
                                <Image
                                    src={imgUrl}
                                    alt={`Imagem ${index + 1} de ${item.title}`}
                                    fill
                                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                                />
                            </div>
                        ))}
                        <div className={styles.PriceBuy}>
                            <p>{item.description}</p>
                            {item.price && <strong className={styles.price}>R$ {item.price}</strong>}
                            <button>Comprar</button>
                        </div>
                    </div>
                </article>
            ))}
        </section>
    );
}

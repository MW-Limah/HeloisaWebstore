'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase'; // cliente configurado
import styles from './boxMenu.module.css';
import Image from 'next/image';

interface BoxItemData {
    id: string;
    title: string;
    images: string[];
    description: string;
    theme: string;
}

export default function BoxItem() {
    const [items, setItems] = useState<BoxItemData[]>([]);

    useEffect(() => {
        async function fetchItems() {
            const { data, error } = await supabase
                .from('box-items') // Nome correto da tabela
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Erro ao buscar itens:', error);
            } else {
                setItems(data as BoxItemData[]);
            }
        }

        fetchItems();
    }, []);

    return (
        <section>
            {items.map((item) => (
                <article key={item.id} className={styles.boxContent}>
                    <div className={styles.boxMenutitle}>
                        <h2>{item.title}</h2>
                    </div>

                    <div className={styles.boxMenu}>
                        {item.images.slice(0, 4).map((imgUrl, index) => (
                            <div key={index} className={styles.boxItem}>
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
                            <button>Comprar</button>
                        </div>
                    </div>
                </article>
            ))}
        </section>
    );
}

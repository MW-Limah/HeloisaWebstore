'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import styles from './BoxItem.module.css';
import Image from 'next/image';
import { PiShoppingCartLight } from 'react-icons/pi';

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
    const [hoveredIndex, setHoveredIndex] = useState<{ [key: string]: boolean }>({});

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
        <section className={styles.gridContainer}>
            {items.map((item) => {
                const firstImage = item.images[0];
                const secondImage = item.images[1] || item.images[0]; // fallback para a primeira imagem

                const isHovered = hoveredIndex[item.id];

                return (
                    <article key={item.id} id={item.theme} className={styles.boxContent}>
                        {/* Imagem principal com hover */}
                        <div
                            className={styles.boxItem}
                            onMouseEnter={() => setHoveredIndex((prev) => ({ ...prev, [item.id]: true }))}
                            onMouseLeave={() => setHoveredIndex((prev) => ({ ...prev, [item.id]: false }))}
                        >
                            <Image
                                src={isHovered ? secondImage : firstImage}
                                alt={`Imagem do item ${item.title}`}
                                fill
                                style={{ objectFit: 'cover', objectPosition: 'center' }}
                            />
                        </div>

                        {/* Título */}
                        <div className={styles.boxMenutitle}>
                            <h2>{item.title}</h2>
                        </div>

                        {/* Preço, Descrição e Botão */}
                        <div className={styles.PriceBuy}>
                            {item.description && <p className={styles.description}>{item.description}</p>}
                            <div className={styles.priceSide}>
                                {item.price && <p className={styles.price}>R${item.price} a unidade</p>}
                                <button className={styles.button}>
                                    <PiShoppingCartLight />
                                </button>
                            </div>
                        </div>
                    </article>
                );
            })}
        </section>
    );
}

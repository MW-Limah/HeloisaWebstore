'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import styles from './BoxItem.module.css';
import Image from 'next/image';
import Link from 'next/link';
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
    const [filteredTheme, setFilteredTheme] = useState<string | null>(null);
    const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Filtro baseado no hash da URL
    useEffect(() => {
        const applyHash = () => {
            const hash = window.location.hash.replace('#', '');
            setFilteredTheme(hash || null);
        };
        applyHash();
        window.addEventListener('hashchange', applyHash);
        return () => window.removeEventListener('hashchange', applyHash);
    }, []);

    // Busca dados do Supabase
    useEffect(() => {
        async function fetchItems() {
            setLoading(true);
            try {
                let query = supabase.from('box-items').select('*');
                if (filteredTheme) query = query.eq('theme', filteredTheme);

                const { data, error } = await query.order('created_at', { ascending: false });

                if (error) throw error;
                setItems(data as BoxItemData[]);
            } catch (err: any) {
                console.error('Erro ao buscar itens:', err.message);
                setError('Não foi possível carregar os itens.');
            } finally {
                setLoading(false);
            }
        }

        fetchItems();
    }, [filteredTheme]);

    // Scroll para o primeiro item ao carregar
    useEffect(() => {
        if (!loading && filteredTheme && items.length > 0) {
            const firstItemRef = itemRefs.current[items[0].id];
            if (firstItemRef) {
                setTimeout(() => {
                    firstItemRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 200);
            }
        }
    }, [items, loading, filteredTheme]);

    if (loading) return <p className={styles.loading}></p>;
    if (error) return <p>{error}</p>;

    return (
        <section className={styles.gridContainer}>
            {items.map((item) => {
                const [firstImage, secondImage] = item.images;
                return (
                    <article
                        key={item.id}
                        className={styles.boxContent}
                        ref={(el: HTMLDivElement | null) => {
                            itemRefs.current[item.id] = el;
                        }}
                    >
                        <Link href={`/checkout/${item.id}`}>
                            <div className={styles.boxItem}>
                                <Image
                                    src={firstImage}
                                    alt={`Imagem do item ${item.title}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    quality={70}
                                    loading="lazy"
                                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                                />
                            </div>

                            <div className={styles.boxMenutitle}>
                                <h2>{item.title}</h2>
                            </div>

                            <div className={styles.PriceBuy}>
                                {item.description && <p className={styles.description}>{item.description}</p>}
                                <div className={styles.priceSide}>
                                    {item.price && <p className={styles.price}>R${item.price},00 a unidade</p>}
                                    <button className={styles.button}>
                                        <PiShoppingCartLight />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    </article>
                );
            })}
        </section>
    );
}

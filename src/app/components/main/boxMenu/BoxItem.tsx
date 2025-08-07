'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import styles from './BoxItem.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { PiShoppingCartLight } from 'react-icons/pi';
import Loading from '@/app/components/Loading/Loading';

interface BoxItemData {
    id: string;
    title: string;
    images: string[];
    description: string;
    theme: string;
    price: string;
}

const BLOCKED_THEME = 'homestuffs';
const shouldRender = (theme?: string) => (theme ?? '').toLowerCase() !== BLOCKED_THEME;

export default function BoxItem() {
    const [items, setItems] = useState<BoxItemData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [filteredTheme, setFilteredTheme] = useState<string | null>(null);
    const itemRefs = useRef<{ [key: string]: HTMLElement | null }>({}); // evita erro de tipagem no <article>

    // Filtro baseado no hash da URL
    useEffect(() => {
        const applyHash = () => {
            const hash = window.location.hash.replace('#', '').toLowerCase(); // normaliza
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
                const normalized = (filteredTheme ?? '').toLowerCase();

                // Se o hash for "homestuffs", este componente não renderiza nada
                if (normalized === BLOCKED_THEME) {
                    setItems([]);
                    setLoading(false);
                    return;
                }

                let query = supabase.from('box-items').select('*');

                if (normalized) {
                    // Quando houver outro hash, filtramos por ele...
                    query = query.eq('theme', normalized);
                } else {
                    // ...sem hash: já exclui homestuffs na query
                    query = query.neq('theme', BLOCKED_THEME);
                }

                const { data, error } = await query.order('created_at', { ascending: false });
                if (error) throw error;

                const parsedData = (data as BoxItemData[])
                    // GARANTIA extra: nunca renderizar homestuffs aqui
                    .filter((i) => shouldRender(i.theme))
                    .map((item) => ({
                        ...item,
                        price: parseFloat(item.price.replace(',', '.')).toFixed(2),
                    }));

                setItems(parsedData);
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

    if (loading) return <Loading />;
    if (error) return <p>{error}</p>;
    if (!items.length) return <p></p>;

    return (
        <section className={styles.gridContainer}>
            {items.map((item) => {
                const [firstImage] = item.images;

                return (
                    <article
                        key={item.id}
                        className={styles.boxContent}
                        ref={(el) => {
                            itemRefs.current[item.id] = el;
                        }}
                    >
                        <Link href={`/checkout/${item.id}`}>
                            <div className={styles.boxItem}>
                                <div className={styles.imageWrapper}>
                                    {firstImage && (
                                        <Image
                                            src={firstImage}
                                            alt={`Imagem do item ${item.title}`}
                                            width={200}
                                            height={250}
                                            quality={100}
                                            loading="lazy"
                                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className={styles.boxMenutitle}>
                                <h3>{item.title}</h3>
                            </div>

                            <div className={styles.PriceBuy}>
                                {item.description && <p className={styles.description}>{item.description}</p>}
                                <div className={styles.priceSide}>
                                    {item.price && (
                                        <p className={styles.price}>
                                            {Number(item.price).toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            })}{' '}
                                            a unidade
                                        </p>
                                    )}

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

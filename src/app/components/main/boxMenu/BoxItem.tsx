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
    price: string; // string no banco
}

const BLOCKED_THEME = 'homestuffs';
const shouldRender = (theme?: string) => (theme ?? '').toLowerCase() !== BLOCKED_THEME;

interface BoxItemProps {
    /** undefined => usa hash; '' => todos (exceto homestuffs); string => filtra */
    filterTheme?: string;
}

export default function BoxItem({ filterTheme }: BoxItemProps) {
    const [items, setItems] = useState<BoxItemData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [filteredTheme, setFilteredTheme] = useState<string | null>(null); // usado quando filterTheme === undefined
    const itemRefs = useRef<{ [key: string]: HTMLElement | null }>({});

    // Escuta hash APENAS quando filterTheme não foi passado
    useEffect(() => {
        if (filterTheme !== undefined) return;
        const applyHash = () => {
            const hash = window.location.hash.replace('#', '').toLowerCase();
            setFilteredTheme(hash || null);
        };
        applyHash();
        window.addEventListener('hashchange', applyHash);
        return () => window.removeEventListener('hashchange', applyHash);
    }, [filterTheme]);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            setError(null);

            try {
                // 1) Quando a prop filterTheme é fornecida, ela manda
                if (filterTheme !== undefined) {
                    const normalized = filterTheme.trim().toLowerCase();

                    // Se pedirem explicitamente "homestuffs" aqui, não renderiza nada (separado do HomeStuffs)
                    if (normalized === BLOCKED_THEME) {
                        setItems([]);
                        return;
                    }

                    let query = supabase.from('box-items').select('*').order('created_at', { ascending: false });

                    if (normalized === '') {
                        // '' => todos, mas SEM homestuffs
                        query = query.neq('theme', BLOCKED_THEME);
                    } else {
                        // tema específico (exceto homestuffs)
                        query = query.eq('theme', normalized).neq('theme', BLOCKED_THEME);
                    }

                    const { data, error } = await query;
                    if (error) throw error;

                    const parsedData = (data as BoxItemData[])
                        .filter((i) => shouldRender(i.theme))
                        .map((item) => ({
                            ...item,
                            price: Number((item.price ?? '0').toString().replace(',', '.')).toFixed(2),
                        }));

                    setItems(parsedData);
                    return;
                }

                // 2) Sem prop: usar regra do hash (comportamento antigo)
                const normalized = (filteredTheme ?? '').toLowerCase();

                // Se o hash for "homestuffs", não renderiza itens aqui
                if (normalized === BLOCKED_THEME) {
                    setItems([]);
                    return;
                }

                let query = supabase.from('box-items').select('*').order('created_at', { ascending: false });

                if (normalized) {
                    // Hash específico => filtra por ele (mas nunca homestuffs aqui)
                    query = query.eq('theme', normalized).neq('theme', BLOCKED_THEME);
                } else {
                    // Sem hash => lista todos, exceto homestuffs
                    query = query.neq('theme', BLOCKED_THEME);
                }

                const { data, error } = await query;
                if (error) throw error;

                const parsedData = (data as BoxItemData[])
                    .filter((i) => shouldRender(i.theme))
                    .map((item) => ({
                        ...item,
                        price: Number((item.price ?? '0').toString().replace(',', '.')).toFixed(2),
                    }));

                setItems(parsedData);
            } catch (err: any) {
                console.error('Erro ao buscar itens:', err?.message || err);
                setError('Não foi possível carregar os itens.');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [filterTheme, filteredTheme]);

    // Scroll suave até o primeiro item ao carregar (apenas quando veio um filtro)
    useEffect(() => {
        if (!loading && (filterTheme || filteredTheme) && items.length > 0) {
            const firstItemRef = itemRefs.current[items[0].id];
            if (firstItemRef) {
                setTimeout(() => {
                    firstItemRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 200);
            }
        }
    }, [items, loading, filterTheme, filteredTheme]);

    if (loading) return <Loading />;
    if (error) return <p>{error}</p>;
    if (!items.length) return <p style={{ display: 'none' }}></p>;

    return (
        <section className={styles.gridContainer}>
            {items.map((item) => {
                const [firstImage] = item.images ?? [];
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
                                            width={180}
                                            height={220}
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
                                        </p>
                                    )}

                                    <button className={styles.button} aria-label="Adicionar ao carrinho">
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

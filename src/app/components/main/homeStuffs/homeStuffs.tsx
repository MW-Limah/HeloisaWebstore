'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import styles from './HomeStuffs.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { PiShoppingCartLight } from 'react-icons/pi';
import Loading from '@/app/components/Loading/Loading';

interface BoxItemData {
    id: string;
    title: string;
    images: string[];
    description?: string;
    theme: string;
    price: string;
}

const THEME = 'homestuffs';

export default function HomeStuffs() {
    const [items, setItems] = useState<BoxItemData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [hashTheme, setHashTheme] = useState<string | null>(null);
    const itemRefs = useRef<Record<string, HTMLElement | null>>({});

    // Ouve mudanças no hash
    useEffect(() => {
        const applyHash = () => {
            const hash = window.location.hash.replace('#', '').toLowerCase();
            setHashTheme(hash || null);
        };
        applyHash();
        window.addEventListener('hashchange', applyHash);
        return () => window.removeEventListener('hashchange', applyHash);
    }, []);

    // Busca dados apenas se hash for homestuffs ou se não houver hash
    useEffect(() => {
        // Se houver hash e for diferente de homestuffs → limpa lista
        if (hashTheme && hashTheme !== THEME) {
            setItems([]);
            setLoading(false);
            return;
        }

        async function fetchItems() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('box-items')
                    .select('*')
                    .eq('theme', THEME)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const parsed = (data as BoxItemData[]).map((item) => ({
                    ...item,
                    price: parseFloat((item.price ?? '0').toString().replace(',', '.')).toFixed(2),
                }));

                setItems(parsed);
            } catch (err: any) {
                console.error('Erro ao buscar itens:', err.message);
                setError('Não foi possível carregar os itens de Casa e decoração.');
            } finally {
                setLoading(false);
            }
        }

        fetchItems();
    }, [hashTheme]);

    if (loading) return <Loading />;
    if (error) return <p>{error}</p>;
    if (!items.length) return <p></p>;

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
                                {firstImage && (
                                    <Image
                                        src={firstImage}
                                        alt={`Imagem do item ${item.title}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        quality={70}
                                        loading="lazy"
                                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                                    />
                                )}
                            </div>

                            <div className={styles.boxMenutitle}>
                                <h2>{item.title}</h2>
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

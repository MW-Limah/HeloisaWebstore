'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import styles from '../boxMenu/BoxItem.module.css';
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
    price: string; // armazenado como string no banco
}

const THEME = 'homestuffs';

/* ✅ 1) Temas bloqueados (tudo que NÃO seja homestuffs) */
const BLOCKED_THEMES = new Set(['eletronicos', 'lacos', 'maquiagens', 'aneis', 'cordoes', 'brincos', 'piranhas']);

interface HomeStuffsProps {
    filterTheme?: string; // '' => todos; undefined => usar regra do hash
}

export default function HomeStuffs({ filterTheme }: HomeStuffsProps) {
    const [items, setItems] = useState<BoxItemData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [hashTheme, setHashTheme] = useState<string | null>(null);
    const itemRefs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        if (filterTheme !== undefined) return; // filtro externo manda
        const applyHash = () => {
            const hash = window.location.hash.replace('#', '').toLowerCase();
            setHashTheme(hash || null);
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
                if (filterTheme !== undefined) {
                    const normalized = filterTheme.trim().toLowerCase();

                    /* ✅ 2) Gate: somente homestuffs é permitido neste componente */
                    if (normalized !== '' && normalized !== THEME) {
                        // Se pediu qualquer tema diferente de homestuffs, não renderiza
                        setItems([]);
                        return;
                    }

                    // '' (Todos) => mostra homestuffs aqui; o restante fica com o BoxItem
                    const { data, error } = await supabase
                        .from('box-items')
                        .select('*')
                        .eq('theme', THEME)
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    const parsed = (data as BoxItemData[])
                        // salvaguarda extra (nunca é demais):
                        .filter((i) => i.theme?.toLowerCase() === THEME)
                        .map((item) => ({
                            ...item,
                            price: Number((item.price ?? '0').toString().replace(',', '.')).toFixed(2),
                        }));

                    setItems(parsed);
                    return;
                }

                // 2) Sem prop: usa regra do hash
                if (hashTheme && hashTheme !== THEME) {
                    setItems([]);
                    return;
                }

                const { data, error } = await supabase
                    .from('box-items')
                    .select('*')
                    .eq('theme', THEME)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const parsed = (data as BoxItemData[])
                    .filter((i) => i.theme?.toLowerCase() === THEME)
                    .map((item) => ({
                        ...item,
                        price: Number((item.price ?? '0').toString().replace(',', '.')).toFixed(2),
                    }));

                setItems(parsed);
            } catch (err: any) {
                console.error('Erro ao buscar itens:', err?.message || err);
                setError('Não foi possível carregar os itens.');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [filterTheme, hashTheme]);

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

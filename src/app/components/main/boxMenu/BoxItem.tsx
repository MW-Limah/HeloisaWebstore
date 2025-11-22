'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import { supabase } from '@/app/lib/supabase';
import styles from './BoxItem.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { PiShoppingCartLight } from 'react-icons/pi';
import Loading from '@/app/components/Loading/Loading';
import Pagination from '@/app/components/pagination/pagination';

interface BoxItemData {
    id: string;
    title: string;
    images: string[];
    description: string;
    theme: string;
    price: string; // string no banco
}

interface BoxItemProps {
    /** undefined => usa hash; '' => todos; string => filtra */
    filterTheme?: string;
}

export default function BoxItem({ filterTheme }: BoxItemProps) {
    const [items, setItems] = useState<BoxItemData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [filteredTheme, setFilteredTheme] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;
    // 🔹 Faz rolagem suave apenas quando o usuário clica na paginação
    const [pageChangedByUser, setPageChangedByUser] = useState(false);

    useEffect(() => {
        if (!pageChangedByUser) return; // 👈 só executa se veio de clique

        const gridElement = document.getElementById('griditems');
        if (gridElement) {
            gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // depois da rolagem, reseta o estado
        setPageChangedByUser(false);
    }, [currentPage, pageChangedByUser]);

    // 🔹 Escuta hash quando filterTheme não for passado
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

    // 🔹 Busca itens com base em filterTheme OU hash
    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                let query = supabase.from('box-items').select('*').order('created_at', { ascending: false });

                // 1️⃣ Quando filterTheme for passado via props
                if (filterTheme !== undefined) {
                    const normalized = filterTheme.trim().toLowerCase();
                    if (normalized) query = query.eq('theme', normalized);
                }

                // 2️⃣ Quando não houver prop, usa o hash detectado
                else if (filteredTheme) {
                    query = query.eq('theme', filteredTheme.toLowerCase());
                }

                const { data, error } = await query;
                if (error) throw error;

                const parsedData = (data as BoxItemData[]).map((item) => ({
                    ...item,
                    price: Number((item.price ?? '0').toString().replace(',', '.')).toFixed(2),
                }));
                setItems(parsedData);
            } catch (err: any) {
                console.error(err);
                setError('Erro ao carregar itens.');
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [filterTheme, filteredTheme]);

    // 🔹 Paginação
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = useMemo(
        () => items.slice(startIndex, startIndex + itemsPerPage),
        [items, startIndex, itemsPerPage]
    );

    // 🔹 Reinicia a página ao mudar filtro
    useEffect(() => {
        setCurrentPage(1);
    }, [filterTheme, filteredTheme]);

    useEffect(() => {
        if (!pageChangedByUser) return; // 👈 só executa se veio de clique

        const gridElement = document.getElementById('griditems');
        if (gridElement) {
            gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // depois da rolagem, reseta o estado
        setPageChangedByUser(false);
    }, [currentPage, pageChangedByUser]);

    if (loading) return <Loading />;
    if (error) return <p>{error}</p>;
    if (!items.length) return <p>Nenhum item encontrado.</p>;

    return (
        <div className={styles.container}>
            <section className={styles.gridContainer}>
                {currentItems.map((item) => (
                    <article key={item.id} className={styles.boxContent}>
                        <Link href={`/checkout/${item.id}`}>
                            <div className={styles.boxItem}>
                                <div className={styles.imageWrapper}>
                                    {item.images?.[0] && (
                                        <Image
                                            src={item.images[0]}
                                            alt={item.title}
                                            width={180}
                                            height={220}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className={styles.details}>
                                <div className={styles.title}>
                                    <h3>{item.title}</h3>
                                </div>
                                {/* 
                                {item.description && <p className={styles.description}>{item.description}</p>} */}
                                <div className={styles.priceAndButton}>
                                    <p>
                                        {Number(item.price).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        })}
                                    </p>
                                    <button className={styles.button}>
                                        <PiShoppingCartLight />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    </article>
                ))}
            </section>
            {/* === Paginação === */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                        const newPage = Math.min(Math.max(page, 1), totalPages);
                        setPageChangedByUser(true); // 👈 marca que o usuário clicou
                        setCurrentPage(newPage);
                    }}
                />
            )}
        </div>
    );
}

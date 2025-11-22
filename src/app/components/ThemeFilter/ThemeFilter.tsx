'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ThemeFilter.module.css';
import { FiFilter, FiX } from 'react-icons/fi';

interface Theme {
    id: string;
    label: string;
}

const themes: Theme[] = [
    { id: 'homestuffs', label: 'Casa e decoração' },
    { id: 'eletronicos', label: 'Eletrônicos' },
    { id: 'lacos', label: 'Laços' },
    { id: 'maquiagens', label: 'Maquiagem' },
    { id: 'aneis', label: 'Anéis' },
    { id: 'pulseiras', label: 'Pulseiras' },
    { id: 'cordoes', label: 'Cordões' },
    { id: 'brincos', label: 'Brincos' },
    { id: 'piranhas', label: 'Piranhas' },
    { id: '', label: 'Todos' },
];

interface ThemeFilterProps {
    onSelectTheme: (themeId: string) => void;
}

export default function ThemeFilter({ onSelectTheme }: ThemeFilterProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isFixed, setIsFixed] = useState(false);

    // Detecta o scroll para alternar entre "relative" e "fixed"
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 450) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClick = (id: string) => {
        onSelectTheme(id);

        if (typeof window !== 'undefined') {
            if (id) {
                window.location.hash = id;
            } else {
                history.replaceState(null, '', window.location.pathname + window.location.search);
                router.refresh();
                setTimeout(() => {
                    window.dispatchEvent(new HashChangeEvent('hashchange'));
                }, 0);
            }
        }

        setIsOpen(false); // fecha o drawer
    };

    return (
        <>
            {/* Botão fixo/relativo */}
            <button
                className={`${styles.drawerToggle} ${isFixed ? styles.fixed : styles.relative}`}
                onClick={() => setIsOpen(true)}
            >
                <FiFilter size={25} />
            </button>

            {/* Painel Drawer */}
            <aside className={`${styles.filterDrawer} ${isOpen ? styles.open : ''}`}>
                <div className={styles.drawerHeader}>
                    <h3>Filtrar por Tema</h3>
                    <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                        <FiX size={20} />
                    </button>
                </div>

                <ul>
                    {themes.map((theme) => (
                        <li key={theme.id}>
                            <button onClick={() => handleClick(theme.id)}>{theme.label}</button>
                        </li>
                    ))}
                </ul>
            </aside>

            {isOpen && <div className={styles.backdrop} onClick={() => setIsOpen(false)} />}
        </>
    );
}

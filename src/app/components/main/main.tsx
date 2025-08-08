'use client';

import styles from './main.module.css';
import BoxMenu from './boxMenu/BoxItem';
import HomeStuffs from './homeStuffs/homeStuffs';
import ThemeFilter from '../ThemeFilter/ThemeFilter';
import { useEffect, useRef, useState } from 'react';
import { RiFilterLine } from 'react-icons/ri';
import { RiFilterOffLine } from 'react-icons/ri';

export default function Main() {
    const [selectedTheme, setSelectedTheme] = useState<string>('');
    const [isFixed, setIsFixed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const phRef = useRef<HTMLDivElement | null>(null);

    // Detecta viewport para alternar entre desktop/mobile
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 900px)');
        const handle = () => setIsMobile(mq.matches);
        handle();
        mq.addEventListener('change', handle);
        return () => mq.removeEventListener('change', handle);
    }, []);

    // Calcula esquerda do placeholder e fixa no desktop
    useEffect(() => {
        if (isMobile) return; // no mobile, drawer cuida do posicionamento
        const update = () => {
            const el = phRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            el.style.setProperty('--filter-left', `${rect.left + window.scrollX}px`);
            setIsFixed(rect.top <= 20);
        };
        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, [isMobile]);

    // Fecha o drawer ao mudar o tema (opcional)
    const handleSelectTheme = (id: string) => {
        setSelectedTheme(id);
        if (isMobile) setIsFilterOpen(false);
    };

    return (
        <main className={styles.Main}>
            {/* DESKTOP: placeholder sólido + filho que alterna para fixed */}
            {!isMobile && (
                <div className={styles.filterPlaceholder} ref={phRef}>
                    <div className={`${styles.filterInner} ${isFixed ? styles.fixed : ''}`}>
                        <ThemeFilter onSelectTheme={handleSelectTheme} />
                    </div>
                </div>
            )}

            {/* MOBILE: botão + drawer retrátil */}
            {isMobile && (
                <>
                    <div className={styles.filterBar}>
                        <button
                            className={styles.filterToggle}
                            aria-expanded={isFilterOpen}
                            aria-controls="filter-drawer"
                            onClick={() => setIsFilterOpen((v) => !v)}
                        >
                            {isFilterOpen ? (
                                <RiFilterOffLine />
                            ) : (
                                <div className={styles.filterToggleBtn}>
                                    <p>Abrir Filtros</p>
                                    <RiFilterLine />
                                </div>
                            )}
                        </button>
                    </div>

                    <div
                        id="filter-drawer"
                        className={`${styles.filterDrawer} ${isFilterOpen ? styles.open : ''}`}
                        role="dialog"
                        aria-modal="true"
                    >
                        <button
                            className={styles.filterToggleIn}
                            aria-expanded={isFilterOpen}
                            aria-controls="filter-drawer"
                            onClick={() => setIsFilterOpen((v) => !v)}
                        >
                            {isFilterOpen ? <RiFilterOffLine /> : <RiFilterLine />}
                        </button>
                        <div className={styles.filterDrawerContent}>
                            <ThemeFilter onSelectTheme={handleSelectTheme} />
                        </div>
                    </div>

                    {/* backdrop */}
                    {isFilterOpen && (
                        <button
                            className={styles.backdrop}
                            aria-label="Fechar filtros"
                            onClick={() => setIsFilterOpen(false)}
                        />
                    )}
                </>
            )}

            <div className={styles.content}>
                <BoxMenu />
                <HomeStuffs filterTheme={selectedTheme} />
            </div>
        </main>
    );
}

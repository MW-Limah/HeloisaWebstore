'use client';

import styles from './main.module.css';
import BoxMenu from './boxMenu/BoxItem';
import ThemeFilter from '../ThemeFilter/ThemeFilter';
import { useEffect, useRef, useState } from 'react';
import { RiFilterLine, RiFilterOffLine } from 'react-icons/ri';

type Mode = 'normal' | 'fixed' | 'absolute';

export default function Main() {
    const [selectedTheme, setSelectedTheme] = useState<string>('');
    const [mode, setMode] = useState<Mode>('normal');
    const [isMobile, setIsMobile] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const mainRef = useRef<HTMLElement | null>(null);
    const phRef = useRef<HTMLDivElement | null>(null); // placeholder que mantém espaço
    const filterRef = useRef<HTMLDivElement | null>(null); // elemento real do filtro

    const lastModeRef = useRef<Mode>('normal');
    const tickingRef = useRef(false);

    // detecta mobile
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 900px)');
        const onChange = () => setIsMobile(mq.matches);
        onChange();
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    // cálculo e controle de posição (fixed / absolute / normal)
    useEffect(() => {
        if (isMobile) {
            const f = filterRef.current;
            const p = phRef.current;
            if (f) {
                f.style.position = '';
                f.style.top = '';
                f.style.left = '';
                f.style.width = '';
            }
            if (p) p.style.height = '';
            setMode('normal');
            lastModeRef.current = 'normal';
            return;
        }

        // mede a altura da navbar fixa e adiciona um espaçamento (gap)
        const getHeaderOffset = () => {
            const nb = document.querySelector('.navbar') as HTMLElement | null;
            const h = nb ? nb.getBoundingClientRect().height : 0;
            const gap = 12; // respiro mínimo entre navbar e filtro
            const extraMargin = 120; // simula o antigo margin-top
            return h + gap + extraMargin;
        };
        const bottomGap = 30; // respiro antes do footer
        const hysteresis = 8; // evita flicker

        const update = () => {
            const ph = phRef.current;
            const main = mainRef.current;
            const f = filterRef.current;
            if (!ph || !main || !f) {
                tickingRef.current = false;
                return;
            }

            const headerOffset = getHeaderOffset();
            const scrollY = window.scrollY || window.pageYOffset;
            const phRect = ph.getBoundingClientRect();
            const mainRect = main.getBoundingClientRect();
            const fHeight = f.offsetHeight || ph.offsetHeight; // altura do filtro
            const phTopAbs = phRect.top + scrollY;
            const mainTopAbs = mainRect.top + scrollY;
            const mainHeight = main.offsetHeight;

            const footerEl = document.querySelector('footer') as HTMLElement | null;
            const footerRect = footerEl ? footerEl.getBoundingClientRect() : null;
            const footerTopAbs = footerRect ? footerRect.top + scrollY : mainTopAbs + mainHeight;

            // limite inferior absoluto (ponto do scroll em que o filtro deve "colar" acima do footer)
            const bottomLimit = footerTopAbs - fHeight - bottomGap;

            // quando começa a fixar, DESCONTANDO a navbar fixa + gap
            const enterFixedAt = phTopAbs - headerOffset;

            // thresholds com histerese
            const leaveFixedAt = bottomLimit - hysteresis;
            const enterAbsoluteAt = bottomLimit - hysteresis / 2;

            let newMode: Mode = 'normal';
            if (scrollY >= enterAbsoluteAt) {
                newMode = 'absolute';
            } else if (scrollY >= enterFixedAt && scrollY <= leaveFixedAt) {
                newMode = 'fixed';
            } else {
                newMode = 'normal';
            }

            if (newMode !== lastModeRef.current) {
                setMode(newMode);
                lastModeRef.current = newMode;
            }

            // mantém o espaço no fluxo para evitar "jump"
            ph.style.height = `${fHeight}px`;

            const leftViewport = Math.round(phRect.left);
            const leftRelativeToMain = Math.round(phRect.left - mainRect.left);
            const widthPx = Math.round(phRect.width);

            if (newMode === 'fixed') {
                f.style.position = 'fixed';
                f.style.top = `${headerOffset}px`; // <-- AGORA abaixo da navbar
                f.style.left = `${leftViewport}px`;
                f.style.width = `${widthPx}px`;
                f.style.transform = 'none';
                f.style.bottom = '';
                f.style.right = '';
            } else if (newMode === 'absolute') {
                const desiredTopAbs = footerTopAbs - bottomGap - fHeight;
                const topRelativeToMain = Math.max(0, Math.round(desiredTopAbs - mainTopAbs));

                f.style.position = 'absolute';
                f.style.top = `${topRelativeToMain}px`;
                f.style.left = `${leftRelativeToMain}px`;
                f.style.width = `${widthPx}px`;
                f.style.transform = 'none';
                f.style.bottom = '';
                f.style.right = '';
            } else {
                f.style.position = '';
                f.style.top = '';
                f.style.left = '';
                f.style.width = '';
                f.style.transform = '';
                f.style.bottom = '';
                f.style.right = '';
                ph.style.height = '';
            }

            tickingRef.current = false;
        };

        const onScrollOrResize = () => {
            if (!tickingRef.current) {
                tickingRef.current = true;
                requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize);
        return () => {
            window.removeEventListener('scroll', onScrollOrResize);
            window.removeEventListener('resize', onScrollOrResize);
        };
    }, [isMobile]);

    // Fecha o drawer ao mudar o tema (mobile)
    const handleSelectTheme = (id: string) => {
        setSelectedTheme(id);
        if (isMobile) setIsFilterOpen(false);
    };

    return (
        <main ref={mainRef} className={styles.Main}>
            {/* DESKTOP: placeholder + filtro real */}
            {!isMobile && (
                <div
                    className={`${styles.filterPlaceholder} ${mode === 'absolute' ? styles.atBottom : ''}`}
                    ref={phRef}
                >
                    <div ref={filterRef} className={`${styles.filterInner} ${mode === 'fixed' ? styles.fixed : ''}`}>
                        <ThemeFilter onSelectTheme={handleSelectTheme} />
                    </div>
                </div>
            )}

            {/* MOBILE: drawer */}
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

                    {isFilterOpen && (
                        <button
                            className={styles.backdrop}
                            aria-label="Fechar filtros"
                            onClick={() => setIsFilterOpen(false)}
                        />
                    )}
                </>
            )}

            <div className={styles.content} id="griditems">
                <BoxMenu />
            </div>
        </main>
    );
}

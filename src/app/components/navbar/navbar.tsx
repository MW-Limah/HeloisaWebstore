'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IoCloseSharp } from 'react-icons/io5';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FaBars, FaHome } from 'react-icons/fa';
import { HiShoppingCart } from 'react-icons/hi';
import { CgProfile } from 'react-icons/cg';
import { PiMagnifyingGlassFill } from 'react-icons/pi';

import styles from './navbar.module.css';

interface Theme {
    id: string;
    label: string;
}

const themes: Theme[] = [
    { id: '', label: 'Todos' },
    { id: 'piranhas', label: 'Piranhas' },
    { id: 'brincos', label: 'Brincos' },
    { id: 'cordoes', label: 'Cordões' },
    { id: 'aneis', label: 'Anéis' },
    { id: 'maquiagens', label: 'Maquiagens' },
    { id: 'lacos', label: 'Laços' },
    { id: 'eletronicos', label: 'Eletrônicos' },
    { id: 'homestuffs', label: 'Casa e Decoração' },
];

export default function Navbar() {
    const [isActive, setIsActive] = useState(false);
    const [logoSrc, setLogoSrc] = useState('/PC.png');
    const [showNavbar, setShowNavbar] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [activeHash, setActiveHash] = useState<string | null>(null); // ← corrigido

    const router = useRouter();
    const pathname = usePathname();
    const lastScrollY = useRef(0);

    // ✅ Detecta se é mobile e troca logo
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 899;
            setIsMobile(mobile);
            setLogoSrc(mobile ? '/mobi.png' : '/PC.png');
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ✅ Define hash inicial apenas no cliente (corrige hydration mismatch)
    useEffect(() => {
        setActiveHash(window.location.hash.replace('#', ''));
    }, []);

    // ✅ Atualiza estado quando hash muda
    useEffect(() => {
        const onHash = () => setActiveHash(window.location.hash.replace('#', ''));
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);

    // ✅ Fecha menu ao clicar fora
    useEffect(() => {
        const closeMenu = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (isActive && !target.closest(`.${styles.menuDrawer}`) && !target.closest(`.${styles.Bars}`)) {
                setIsActive(false);
            }
        };
        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener('click', closeMenu);
    }, [isActive]);

    // ✅ Controla hash manualmente e faz scroll até os items
    const handleHash = (id: string) => {
        setActiveHash(id);

        if (id) {
            window.location.hash = id;
        } else {
            history.replaceState(null, '', window.location.pathname + window.location.search);
            router.refresh();
            setTimeout(() => {
                window.dispatchEvent(new HashChangeEvent('hashchange'));
            }, 0);
        }

        // 👇 Fechar menu no mobile
        setIsActive(false);

        // 👇 Rolar suavemente até os items
        setTimeout(() => {
            const grid = document.getElementById('griditems');
            if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    };

    // ✅ Mostrar/esconder barra conforme scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;

            if (pathname !== '/') {
                setShowNavbar(false);
                lastScrollY.current = currentScroll;
                return;
            }

            if (currentScroll < 100) {
                setShowNavbar(true);
            } else {
                setShowNavbar(false);
            }

            lastScrollY.current = currentScroll;
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    const renderHome = pathname !== '/';
    const renderReturn = pathname !== '/';
    const renderCart = pathname !== '/cart';

    // 🚫 Evita renderizar antes do estado do cliente existir (corrige 100% hydration)
    if (activeHash === null) return null;

    return (
        <nav
            className={`${styles.navbar} ${
                pathname !== '/' ? styles.halfHide : showNavbar ? styles.show : styles.hide
            }`}
        >
            {/* TOPO */}
            <div className={styles.top}>
                <ul className={styles.desktopOnly}>
                    {renderHome && (
                        <li>
                            <Link href="/">
                                Início
                                <FaHome className={styles.icon} />
                            </Link>
                        </li>
                    )}
                    {renderReturn && (
                        <li
                            onClick={(e) => {
                                e.preventDefault();
                                router.back();
                            }}
                        >
                            <IoMdArrowRoundBack />
                            Voltar página
                        </li>
                    )}
                    <li>
                        Pesquisar
                        <PiMagnifyingGlassFill />
                    </li>
                    {renderCart && (
                        <li>
                            <Link href="/cart">Carrinho</Link>
                            <HiShoppingCart />
                        </li>
                    )}
                    <li>
                        Login / Registrar
                        <CgProfile />
                    </li>
                </ul>

                {isMobile && (
                    <div className={styles.Bars} onClick={() => setIsActive((prev) => !prev)}>
                        {isActive ? <IoCloseSharp /> : <FaBars />}
                    </div>
                )}
            </div>

            {/* LOGO */}
            <div className={styles.middle}>
                <div className={styles.imageWrapper}>
                    <Image src={logoSrc} fill alt="Logo Principal Heloisa Moda Feminina" />
                </div>
            </div>

            {/* LINKS PRINCIPAIS */}
            {!isMobile && (
                <div className={styles.bottom}>
                    <ul>
                        {themes.map((t) => (
                            <li key={t.id || 'todos'}>
                                <a
                                    href={t.id ? `#${t.id}` : '#'}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleHash(t.id);
                                    }}
                                    className={activeHash === t.id ? styles.activeLink : ''}
                                >
                                    {t.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* MENU RETRÁTIL */}
            <ul className={`${styles.menuDrawer} ${isActive ? styles.active : ''}`}>
                <li>Pesquisar</li>
                {renderReturn && (
                    <li
                        onClick={(e) => {
                            e.preventDefault();
                            router.back();
                        }}
                    >
                        <IoMdArrowRoundBack className={styles.icon} />
                        Voltar página
                    </li>
                )}
                {renderHome && (
                    <li>
                        <Link href="/">
                            <FaHome className={styles.icon} />
                            Início
                        </Link>
                    </li>
                )}
                {renderCart && (
                    <li>
                        <Link href="/cart">Carrinho</Link>
                    </li>
                )}
                <li>Login / Registrar</li>
                {renderCart && (
                    <li>
                        <Link href="/pages/Admin">Administradores</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}

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
import { RiAdminFill } from 'react-icons/ri';
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
    const [logoSrc, setLogoSrc] = useState('/Logo_PC.png');
    const [showNavbar, setShowNavbar] = useState<true | false | 'half' | 'hideFull'>(true);

    const [isMobile, setIsMobile] = useState(false);
    const [activeHash, setActiveHash] = useState<string | null>(null);

    const router = useRouter();
    const pathname = usePathname();
    const lastScrollY = useRef(0);

    // ✅ Detecta se é mobile e troca logo
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 899;
            setIsMobile(mobile);
            setLogoSrc(mobile ? '/Logo_Mobile.png' : '/Logo_PC.png');
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ✅ Define hash inicial
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

    // ✅ Controla hash manualmente e faz scroll
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
        setIsActive(false);
        setTimeout(() => {
            const grid = document.getElementById('griditems');
            if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const scrollingUp = currentScroll < lastScrollY.current;

            // Fora da home → sempre halfHide
            if (pathname !== '/') {
                setShowNavbar('half');
                lastScrollY.current = currentScroll;
                return;
            }

            // No topo
            if (currentScroll < 100) {
                setShowNavbar(true);
            }
            // Rolando para cima → hide (parcial)
            else if (scrollingUp) {
                setShowNavbar(false);
            }
            // Rolando para baixo → hideFull (100%)
            else {
                setShowNavbar('hideFull');
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

    if (activeHash === null) return null;

    // 🧩 Escolha da classe principal baseada nas novas regras
    const navbarClass =
        pathname !== '/'
            ? styles.halfHide // telas diferentes de "/"
            : showNavbar === true
            ? styles.show
            : styles.hide;

    return (
        <nav
            className={`${styles.navbar} ${
                pathname !== '/'
                    ? styles.halfHide
                    : showNavbar === true
                    ? styles.show
                    : showNavbar === 'half'
                    ? styles.halfHide
                    : showNavbar === false
                    ? styles.hide
                    : styles.hideFull
            }`}
        >
            {/* ====== TOPO ====== */}
            {!(pathname === '/' && showNavbar === 'half') && (
                <div className={styles.top}>
                    <ul className={styles.desktopOnly}>
                        {renderHome && (
                            <li>
                                <Link href="/">
                                    Início
                                    <FaHome />
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
                        {renderCart && (
                            <li>
                                <Link href="/cart">Carrinho</Link>
                                <HiShoppingCart />
                            </li>
                        )}
                    </ul>

                    {isMobile && (
                        <div className={styles.Bars} onClick={() => setIsActive((prev) => !prev)}>
                            {isActive ? <IoCloseSharp /> : <FaBars />}
                        </div>
                    )}
                </div>
            )}

            {/* ====== LOGO ====== */}
            <div className={styles.middle}>
                <div className={styles.imageWrapper}>
                    <Image src={logoSrc} fill alt="Logo Principal Heloisa Moda Feminina" />
                </div>
            </div>

            {/* ====== LINKS PRINCIPAIS ====== */}
            {pathname === '/' && !isMobile && (
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

            {/* ====== MENU RETRÁTIL ====== */}
            <ul className={`${styles.menuDrawer} ${isActive ? styles.active : ''}`}>
                <li>Pesquisar</li>
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
                {renderHome && (
                    <li>
                        <Link href="/">
                            <FaHome />
                            Início
                        </Link>
                    </li>
                )}
                {renderCart && (
                    <li>
                        <HiShoppingCart />
                        <Link href="/cart">Carrinho</Link>
                    </li>
                )}
                <li>
                    <CgProfile />
                    Login / Registrar
                </li>
                {renderCart && (
                    <li>
                        <RiAdminFill />
                        <Link href="/pages/Admin">Administradores</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}

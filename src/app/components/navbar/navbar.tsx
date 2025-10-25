'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IoCloseSharp } from 'react-icons/io5';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FaBars, FaHome } from 'react-icons/fa';
import { FaMagnifyingGlass } from 'react-icons/fa6';
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
    const [activeHash, setActiveHash] = useState<string>(() =>
        typeof window !== 'undefined' ? location.hash.replace('#', '') : ''
    );

    const router = useRouter();
    const pathname = usePathname();
    const lastScrollY = useRef(0);

    const toggleMenu = () => setIsActive((prev) => !prev);
    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        router.back();
    };

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

    // ✅ Atualiza estado quando hash muda
    useEffect(() => {
        const onHash = () => setActiveHash(location.hash.replace('#', ''));
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);

    // ✅ Controla hash manualmente
    const handleHash = (id: string) => {
        setActiveHash(id);
        if (typeof window === 'undefined') return;

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
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;

            // Se não for a página principal → sempre meia-recolhida (classe halfHide)
            if (pathname !== '/') {
                setShowNavbar(false);
                lastScrollY.current = currentScroll;
                return;
            }

            // Só expande se estivermos perto do topo
            if (currentScroll < 250) {
                setShowNavbar(true);
            } else {
                // Em qualquer posição abaixo de 100px, mantém recolhida
                setShowNavbar(false);
            }

            lastScrollY.current = currentScroll;
        };

        // chama uma vez para aplicar estado inicial corretamente
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    const renderHome = pathname !== '/';
    const renderReturn = pathname !== '/';
    const renderCart = pathname !== '/cart';

    return (
        <nav
            className={`${styles.navbar} ${
                pathname !== '/'
                    ? styles.halfHide // 👈 demais páginas
                    : showNavbar
                    ? styles.show // 👈 home no topo
                    : styles.hide // 👈 home rolada
            }`}
        >
            {/* TOPO */}
            <div className={styles.top}>
                <ul className={styles.desktopOnly}>
                    {renderReturn && <li onClick={handleBack}>Voltar página</li>}
                    <li>Pesquisar</li>
                    {renderCart && (
                        <li>
                            <Link href={'/cart'}>Carrinho</Link>
                        </li>
                    )}
                    <li>Login / Registrar</li>
                </ul>

                {/* Ícone do menu hambúrguer */}
                {isMobile && (
                    <div className={styles.Bars} onClick={toggleMenu}>
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

            {/* MENU RETRÁTIL (Drawer) */}
            <ul className={`${styles.menuDrawer} ${isActive ? styles.active : ''}`}>
                <li>Pesquisar</li>
                {renderReturn && (
                    <li onClick={handleBack}>
                        <IoMdArrowRoundBack className={styles.icon} />
                        Voltar página
                    </li>
                )}
                {renderHome && (
                    <li>
                        <Link href={'/'}>
                            <FaHome className={styles.icon} />
                            Início
                        </Link>
                    </li>
                )}
                {renderCart && (
                    <li>
                        <Link href={'/cart'}>Carrinho</Link>
                    </li>
                )}
                {/* 🔽 Adicionados no menu retrátil */}
                <li>Login / Registrar</li>
                {renderCart && (
                    <li>
                        <Link href={'/pages/Admin'}>Administradores</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}

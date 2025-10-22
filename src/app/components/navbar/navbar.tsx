'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IoCloseSharp } from 'react-icons/io5';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FaUser, FaBars, FaHome } from 'react-icons/fa';
import { PiShoppingCartFill } from 'react-icons/pi';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import styles from './navbar.module.css';

export default function Navbar() {
    const [isActive, setIsActive] = useState(false);
    const [logoSrc, setLogoSrc] = useState('/pc.png');
    const linksRef = useRef<HTMLUListElement | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    const toggleMenu = () => setIsActive((prev) => !prev);
    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        router.back();
    };

    // ✅ Detecta largura e troca logo
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 899px)');
        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
            if (e.matches) {
                setLogoSrc('/mobi.png');
            } else {
                setLogoSrc('/pc.png');
            }
        };
        handleChange(mediaQuery);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Fecha menu ao clicar fora
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

    const renderHome = pathname !== '/';
    const renderReturn = pathname !== '/';
    const renderCart = pathname !== '/cart';

    return (
        <nav className={styles.navbar}>
            <div className={styles.content}>
                {/* TOPO */}
                <div className={styles.top}>
                    {/* 🔹 Itens que somem no mobile */}
                    <ul className={styles.desktopOnly}>
                        <li>
                            Pesquisar <FaMagnifyingGlass />
                        </li>
                        <li>Login / Registrar</li>
                    </ul>

                    {/* 🔹 Ícone do menu hambúrguer (mostra só no mobile) */}
                    <div className={styles.Bars} onClick={toggleMenu}>
                        {isActive ? <IoCloseSharp /> : <FaBars />}
                    </div>
                </div>

                {/* LOGO */}
                <div className={styles.middle}>
                    <div className={styles.imageWrapper}>
                        <Image src={logoSrc} fill alt="Logo Principal Heloisa Moda Feminina" />
                    </div>
                </div>

                {/* LINKS PRINCIPAIS */}
                <div className={styles.bottom}>
                    <ul ref={linksRef}>
                        <li>
                            <a href="">Todos</a>
                        </li>
                        <li>
                            <a href="">Piranhas</a>
                        </li>
                        <li>
                            <a href="">Brincos</a>
                        </li>
                        <li>
                            <a href="">Cordões</a>
                        </li>
                        <li>
                            <a href="">Anéis</a>
                        </li>
                        <li>
                            <a href="">Maquiagens</a>
                        </li>
                        <li>
                            <a href="">Laços</a>
                        </li>
                        <li>
                            <a href="">Eletrônicos</a>
                        </li>
                        <li>
                            <a href="">Casa e Decoração</a>
                        </li>
                    </ul>
                </div>
            </div>

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

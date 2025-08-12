'use client';

import styles from './navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import { usePathname } from 'next/navigation';
import Cart from '@/app/components/GoCart/GoCart';

export default function Navbar() {
    const [isActive, setIsActive] = useState(false);
    const linksRef = useRef<HTMLUListElement | null>(null);
    const [showArrows, setShowArrows] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsActive((prev) => !prev);
    };

    // Fecha ao clicar fora
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

    // Scroll inicial
    useEffect(() => {
        const el = linksRef.current;
        if (el) {
            el.scrollLeft = el.scrollWidth;
        }
    }, []);

    // Detecta overflow para mostrar setas
    useEffect(() => {
        const el = linksRef.current;
        if (!el) return;

        const checkOverflow = () => {
            setShowArrows(el.scrollWidth > el.clientWidth);
        };

        let resizeTimeout: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(checkOverflow, 200);
        };

        checkOverflow();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLinkClick = (hash: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        if (window.location.hash === `#${hash}`) {
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        } else {
            window.location.hash = hash;
        }
    };

    return (
        <nav className={styles.navbar} id="Início">
            <div className={styles.topContent}>
                <div className={styles.leftContent}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src={'/logo_1.webp'}
                            width={100}
                            height={100}
                            alt="Logo Principal Heloisa Moda Feminina"
                        />
                    </div>
                </div>

                <div className={styles.rightContent}>
                    <Link href={'/contato'}>Contato</Link>
                    <Cart />
                    <Link href="/pages/Login">Administrador</Link>
                </div>

                <div className={styles.mobileOnly}>{pathname !== '/cart' && <Cart />}</div>

                <div className={styles.Bars} onClick={toggleMenu}>
                    {isActive ? <IoCloseSharp /> : <FaBars />}
                </div>
            </div>

            {/* Mantém sempre no DOM */}
            <ul className={`${styles.menuDrawer} ${isActive ? styles.active : ''}`}>
                <li>
                    <Link href={'/'}>Início</Link>
                </li>
                <li>
                    <Link href={'/cart'}>Carrinho</Link>
                </li>
                <li>
                    <Link href={'/contato'}>Contato</Link>
                </li>
                <li>
                    <Link href="/pages/Login">Administrador</Link>
                </li>
            </ul>
        </nav>
    );
}

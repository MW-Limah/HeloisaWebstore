'use client';

import styles from './navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';

export default function Navbar() {
    const [isActive, setIsActive] = useState(false);
    const linksRef = useRef<HTMLUListElement | null>(null);
    const [showArrows, setShowArrows] = useState(false);

    const toggleMenu = () => {
        setIsActive(!isActive);
    };

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

    useEffect(() => {
        const el = linksRef.current;
        if (el) {
            el.scrollLeft = el.scrollWidth;
        }
    }, []);

    useEffect(() => {
        const el = linksRef.current;
        if (!el) return;

        const checkOverflow = () => {
            setShowArrows(el.scrollWidth > el.clientWidth);
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, []);

    const handleLinkClick = (hash: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        if (window.location.hash === `#${hash}`) {
            // Força manualmente o evento se o hash já for o mesmo
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        } else {
            window.location.hash = hash;
        }
    };

    return (
        <nav className={styles.navbar} id="Início">
            <div className={styles.topContent}>
                <div className={styles.leftContent}>
                    <Image src={'/logo_1.webp'} width={100} height={100} alt="Logo Principal Heloisa Moda Feminina" />
                </div>
                <div className={styles.rightContent}>
                    <Link href={'#'}>Olá, inscreva-se para atualizações</Link>
                    <Link href={'#'}>Entre em contato!</Link>
                    <Link href="/pages/Login">Acessar área Admin</Link>
                </div>
                <div className={styles.Bars} onClick={toggleMenu}>
                    {isActive ? <IoCloseSharp /> : <FaBars />}
                </div>
            </div>

            <div className={`${styles.menuDrawer} ${isActive ? styles.active : ''}`}>
                <li className={styles.mobileOnly}>
                    <Link href={'#'}>Olá, inscreva-se para atualizações</Link>
                </li>
                <li className={styles.mobileOnly}>
                    <Link href={'#'}>Entre em contato!</Link>
                </li>
                <li className={`${styles.mobileOnly} ${styles.Admin}`}>
                    <Link href="/pages/Login">Acessar área Admin</Link>
                </li>
            </div>

            <div className={styles.scrollContainer}>
                {showArrows && (
                    <button
                        className={`${styles.arrow} ${styles.leftArrow}`}
                        onClick={() => linksRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
                    >
                        {'‹'}
                    </button>
                )}

                <div className={styles.scrollWrapper}>
                    <ul className={styles.linksMenu} ref={linksRef}>
                        <li>
                            <a href="#Fones" onClick={handleLinkClick('Fones')}>
                                Fones
                            </a>
                        </li>
                        <li>
                            <a href={'#Lacos'} onClick={handleLinkClick('Lacos')}>
                                Laços
                            </a>
                        </li>
                        <li>
                            <a href={'#Maquiagens'} onClick={handleLinkClick('Maquiagens')}>
                                Maquiagem
                            </a>
                        </li>
                        <li>
                            <a href={'#Aneis'} onClick={handleLinkClick('Aneis')}>
                                Anéis
                            </a>
                        </li>
                        <li>
                            <a href={'#Pulseiras'} onClick={handleLinkClick('Pulseiras')}>
                                Pulseiras
                            </a>
                        </li>
                        <li>
                            <a href={'#Brincos'} onClick={handleLinkClick('Brincos')}>
                                Brincos
                            </a>
                        </li>
                        <li>
                            <a href={'#Piranhas'} onClick={handleLinkClick('Piranhas')}>
                                Piranhas
                            </a>
                        </li>
                        <li>
                            <a href={'/'} onClick={handleLinkClick('')}>
                                Todos
                            </a>
                        </li>
                    </ul>
                </div>

                {showArrows && (
                    <button
                        className={`${styles.arrow} ${styles.rightArrow}`}
                        onClick={() => linksRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
                    >
                        {'›'}
                    </button>
                )}
            </div>
        </nav>
    );
}

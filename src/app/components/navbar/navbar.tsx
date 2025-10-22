'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IoCloseSharp } from 'react-icons/io5';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FaUser, FaBars, FaHome } from 'react-icons/fa';
import { MdConnectWithoutContact } from 'react-icons/md';
import { PiShoppingCartFill } from 'react-icons/pi';
import styles from './navbar.module.css';

export default function Navbar() {
    const [isActive, setIsActive] = useState(false);
    const linksRef = useRef<HTMLUListElement | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    const toggleMenu = () => {
        setIsActive((prev) => !prev);
    };

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        router.back();
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

    const renderHome = pathname !== '/';
    const renderReturn = pathname !== '/';
    const renderCart = pathname !== '/cart';
    const renderContact = pathname !== '/contato';

    return (
        <nav className={styles.navbar} id="Início">
            <div className={styles.leftContent}>
                <div className={styles.imageWrapper}>
                    <Image src={'/logo_1.png'} fill alt="Logo Principal Heloisa Moda Feminina" />
                </div>
            </div>

            <div className={styles.rightContent}>
                <ul>
                    {renderReturn && (
                        <li style={{ marginRight: '10px' }}>
                            <a href="#" onClick={handleBack}>
                                <IoMdArrowRoundBack className={styles.icon} />
                                Voltar página
                            </a>
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
                            <Link href={'/cart'}>
                                <PiShoppingCartFill className={styles.icon} />
                                Carrinho
                            </Link>
                        </li>
                    )}

                    {/* {renderContact && (
                            <li>
                                <Link href={'/contato'}>
                                    <MdConnectWithoutContact className={styles.icon} />
                                    Contato
                                </Link>
                            </li>
                        )} */}

                    <li>
                        <Link href="/pages/Login">
                            <FaUser className={styles.icon} />
                            Administrador
                        </Link>
                    </li>
                </ul>
            </div>

            <div className={styles.Bars} onClick={toggleMenu}>
                {isActive ? <IoCloseSharp /> : <FaBars />}
            </div>

            {/* Drawer */}
            <ul className={`${styles.menuDrawer} ${isActive ? styles.active : ''}`}>
                {renderHome && (
                    <li style={{ marginBottom: '10px' }}>
                        <a href="#" onClick={handleBack}>
                            <IoMdArrowRoundBack className={styles.icon} />
                            Voltar página
                        </a>
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
                        <Link href={'/cart'}>
                            <PiShoppingCartFill className={styles.icon} />
                            Carrinho
                        </Link>
                    </li>
                )}

                {/*  {renderContact && (
                    <li>
                        <Link href={'/contato'}>
                            <MdConnectWithoutContact className={styles.icon} />
                            Contato
                        </Link>
                    </li>
                )} */}

                <li>
                    <Link href="/pages/Login">
                        <FaUser className={styles.icon} />
                        Administrador
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

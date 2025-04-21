'use client';

import styles from './navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';

export default function Navbar() {
    const [isActive, setIsActive] = useState(false);
    const linksRef = useRef(null);

    const toggleMenu = () => {
        setIsActive(!isActive);
    };

    useEffect(() => {
        const closeMenu = (e) => {
            if (isActive && !e.target.closest(`.${styles.menuDrawer}`) && !e.target.closest(`.${styles.Bars}`)) {
                setIsActive(false);
            }
        };

        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener('click', closeMenu);
    }, [isActive]);

    const handleLinkClick = () => {
        setTimeout(() => {
            window.location.reload();
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }, 1260);
    };

    useEffect(() => {
        const el = linksRef.current;
        if (!el) return;

        const handleScroll = () => {
            if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
                const currentItems = Array.from(el.children);
                currentItems.forEach((item) => {
                    const clone = item.cloneNode(true);
                    el.appendChild(clone);
                });
            }
        };

        el.addEventListener('scroll', handleScroll);
        return () => el.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={styles.navbar} id="Início">
            {/* Topo da Navbar */}
            <div className={styles.topContent}>
                <div className={styles.leftContent}>
                    <Image src={'/logo_1.png'} width={100} height={100} alt="Logo Principal Heloisa Moda Feminina" />
                </div>
                <div className={styles.rightContent}>
                    <Link href={'#'}>Olá, inscreva-se para atualizações</Link> <Link href={'#'}>Entre em contato!</Link>
                    <Link href="/pages/Login">Acessar área Admin</Link>
                </div>
                <div className={styles.Bars} onClick={toggleMenu}>
                    {isActive ? <IoCloseSharp /> : <FaBars />}
                </div>
            </div>
            {/* Drawer lateral apenas para conteúdo extra em telas pequenas */}
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
            {/* Barra inferior com scroll infinito */}
            <ul className={styles.linksMenu} ref={linksRef}>
                <li>
                    <Link href={'/'} onClick={handleLinkClick}>
                        Todos
                    </Link>
                </li>
                <li>
                    <Link href={'#Brincos'} onClick={handleLinkClick}>
                        Brincos
                    </Link>
                </li>
                <li>
                    <Link href={'#Piranhas'} onClick={handleLinkClick}>
                        Piranhas
                    </Link>
                </li>
                <li>
                    <Link href={'#Maquiagens'} onClick={handleLinkClick}>
                        Maquiagem
                    </Link>
                </li>
                <li>
                    <Link href={'#Pulseiras'} onClick={handleLinkClick}>
                        Pulseiras
                    </Link>
                </li>
                <li>
                    <Link href={'#Aneis'} onClick={handleLinkClick}>
                        Anéis
                    </Link>
                </li>
                <li>
                    <Link href={'#Fones'} onClick={handleLinkClick}>
                        Fones
                    </Link>
                </li>
                <li>
                    <Link href={'#Capas'} onClick={handleLinkClick}>
                        Capinhas de Celular
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

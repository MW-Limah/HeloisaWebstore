'use client';

import styles from './navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';

export default function Navbar() {
    const [isActive, setIsActive] = useState(false);

    const toggleMenu = () => {
        setIsActive(!isActive);
    };

    useEffect(() => {
        const closeMenu = (e) => {
            if (isActive && !e.target.closest(`.${styles.navbarContent}`)) {
                setIsActive(false);
            }
        };

        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener('click', closeMenu);
    }, [isActive]);

    /* const scrollToProjects = () => {
        const projectsSection = document.getElementById('anotherLinks');
        if (projectsSection) {
            const offset = -100; // Ajuste fino, negativo sobe mais
            const top = projectsSection.getBoundingClientRect().top + window.scrollY + offset;

            window.scrollTo({
                top: top,
                behavior: 'smooth', // Deve funcionar no Chrome, Firefox e Edge
            });
        } 
    };*/

    return (
        <nav className={styles.navbar}>
            <div className={styles.topContent}>
                <div className={styles.leftContent}>
                    <Image src={'/logo_1.png'} width={100} height={100} alt="Logo Principal Heloisa Moda Feminina" />
                </div>
                <div className={styles.rightContent}>
                    <Link href={'#'}>Olá, inscreva-se para atualizações</Link>
                    <Link href={'#'}>Entre em contato!</Link>
                </div>
            </div>
            <div className={styles.bottomContent}>
                <ul>
                    <div className={styles.gp1}>
                        <li className={styles.Bars} onClick={toggleMenu}>
                            {isActive ? (
                                <IoCloseSharp style={{ color: 'white' }} />
                            ) : (
                                <FaBars style={{ color: 'white' }} />
                            )}
                        </li>
                        <li>
                            <Link href={'#'}>Brincos</Link>
                        </li>
                        <li>
                            <Link href={'#'}>Piranhas</Link>
                        </li>
                    </div>
                    <div className={`${styles.gp2} ${isActive ? styles.active : ''}`}>
                        <li>
                            <Link href={'#'}>Maquiagem</Link>
                        </li>

                        <li>
                            <Link href={'#'}>Pulseiras</Link>
                        </li>
                        <li>
                            <Link href={'#'}>Anéis</Link>
                        </li>
                    </div>
                </ul>
            </div>
        </nav>
    );
}

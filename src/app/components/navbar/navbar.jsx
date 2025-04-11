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

    return (
        <nav className={styles.navbar} id="Início">
            <div className={styles.topContent}>
                <div className={styles.leftContent}>
                    <Image src={'/logo_1.png'} width={100} height={100} alt="Logo Principal Heloisa Moda Feminina" />
                </div>
                <div className={styles.rightContent}>
                    <Link href={'#'}>Olá, inscreva-se para atualizações</Link>
                    <Link href={'#'}>Entre em contato!</Link>
                    <Link href="/pages/Login">Acessar área Admin</Link>
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
                            <Link href={'#Brincos'}>Brincos</Link>
                        </li>
                        <li>
                            <Link href={'#Piranhas'}>Piranhas</Link>
                        </li>
                    </div>
                    <div className={`${styles.gp2} ${isActive ? styles.active : ''}`}>
                        <li>
                            <Link href={'#Maquiagens'}>Maquiagem</Link>
                        </li>

                        <li>
                            <Link href={'#Pulseiras'}>Pulseiras</Link>
                        </li>
                        <li>
                            <Link href={'#Aneis'}>Anéis</Link>
                        </li>
                    </div>
                </ul>
            </div>
        </nav>
    );
}

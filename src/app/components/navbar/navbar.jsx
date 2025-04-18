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
            if (isActive && !e.target.closest(`.${styles.gp2}`) && !e.target.closest(`.${styles.Bars}`)) {
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

                {/* Visível apenas em telas maiores que 1100px */}
                <div className={styles.rightContent}>
                    <Link href={'#'}>Olá, inscreva-se para atualizações</Link>
                    <Link href={'#'}>Entre em contato!</Link>
                    <Link href="/pages/Login">Acessar área Admin</Link>
                </div>

                {/* Ícone do menu para telas menores */}
                <div className={styles.Bars} onClick={toggleMenu}>
                    {isActive ? <IoCloseSharp /> : <FaBars />}
                </div>
            </div>

            <div className={`${styles.gp2} ${isActive ? styles.active : ''}`}>
                <ul className={styles.linksMenu}>
                    <li>
                        <Link href={'#Brincos'}>Brincos</Link>
                    </li>
                    <li>
                        <Link href={'#Piranhas'}>Piranhas</Link>
                    </li>
                    <li>
                        <Link href={'#Maquiagens'}>Maquiagem</Link>
                    </li>
                    <li>
                        <Link href={'#Pulseiras'}>Pulseiras</Link>
                    </li>
                    <li>
                        <Link href={'#Aneis'}>Anéis</Link>
                    </li>

                    {/* Estes aparecem só em mobile */}
                    <li className={styles.mobileOnly}>
                        <Link href={'#'}>Olá, inscreva-se para atualizações</Link>
                    </li>
                    <li className={styles.mobileOnly}>
                        <Link href={'#'}>Entre em contato!</Link>
                    </li>
                    <li className={`${styles.mobileOnly} ${styles.Admin}`}>
                        <Link href="/pages/Login">Acessar área Admin</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

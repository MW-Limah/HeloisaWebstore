'use client';

import Link from 'next/link';
import styles from './justTop.module.css';
import { useState } from 'react';
import Image from 'next/image';
import { IoCloseSharp } from 'react-icons/io5';
import { FaBars } from 'react-icons/fa';

export default function JustTop() {
    const [isActive, setIsActive] = useState(false);
    const toggleMenu = () => {
        setIsActive(!isActive);
    };

    return (
        <div className={styles.navbar}>
            <div className={styles.topContent}>
                <div className={styles.leftContent}>
                    <Image src={'/logo_1.webp'} width={100} height={100} alt="Logo Principal Heloisa Moda Feminina" />
                </div>
                <div className={styles.rightContent}>
                    <Link href={'#'} className={styles.back}>
                        Voltar ao início
                    </Link>
                    <Link href={'#'}>Olá, inscreva-se para atualizações</Link>
                    <Link href="/pages/Login">Acessar área Admin</Link>
                </div>
                <div className={styles.Bars} onClick={toggleMenu}>
                    {isActive ? <IoCloseSharp /> : <FaBars />}
                </div>
            </div>

            <div className={`${styles.menuDrawer} ${isActive ? styles.active : ''}`}>
                <li className={styles.mobileOnly}>
                    <Link href={'#'}>Voltar ao início</Link>
                </li>
                <li className={styles.mobileOnly}>
                    <Link href={'#'}>Olá, inscreva-se para atualizações</Link>
                </li>
                <li className={`${styles.mobileOnly} ${styles.Admin}`}>
                    <Link href="/pages/Login">Acessar área Admin</Link>
                </li>
            </div>
        </div>
    );
}

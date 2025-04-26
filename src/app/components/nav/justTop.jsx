'use client';

import { useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { FaBars } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './justTop.module.css';
import ButtonBack from '@/app/components/buttonBack/buttonBack';
import Cart from '@/app/components/GoCart/GoCart';

export default function JustTop() {
    const [isActive, setIsActive] = useState(false);
    const pathname = usePathname();
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
                    <ButtonBack />
                    <Link href={'#'}>Olá, inscreva-se para atualizações</Link>
                    <Link href="/pages/Login">Acessar área Admin</Link>
                    {pathname !== '/contato' && <Link href={'/contato'}>Entre em contato!</Link>}
                    {pathname !== '/cart' && <Cart />}
                </div>
                <li className={styles.mobileOnly}>{pathname !== '/cart' && <Cart />}</li>
                <div className={styles.Bars} onClick={toggleMenu}>
                    {isActive ? <IoCloseSharp /> : <FaBars />}
                </div>
            </div>

            <div className={`${styles.menuDrawer} ${isActive ? styles.active : ''}`}>
                <li className={styles.mobileOnly}>
                    <Link href={'/'}>Voltar ao início</Link>
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

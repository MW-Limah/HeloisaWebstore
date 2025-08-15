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
import { useRouter } from 'next/navigation';

export default function JustTop() {
    const [isActive, setIsActive] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const handleBack = () => {
        if (window.history.length > 1) {
            router.push('/');
        } else {
            router.push('/');
        }
    };
    const toggleMenu = () => {
        setIsActive(!isActive);
    };

    return (
        <div className={styles.navbar}>
            <div className={styles.topContent}>
                <div className={styles.leftContent}>
                    <div className={styles.imageWrapper}>
                        <button className={styles.backImg} onClick={handleBack}>
                            <Image
                                src={'/logo_1.webp'}
                                width={100}
                                height={100}
                                alt="Logo Principal Heloisa Moda Feminina"
                            />
                        </button>
                    </div>
                </div>
                <div className={styles.rightContent}>
                    <ButtonBack />
                    {pathname !== '/contato' && <Link href={'/contato'}>Contate-nos</Link>}
                    {pathname !== '/cart' && <Cart />}
                    <Link href="/pages/Login">Área ADM</Link>
                </div>
                <div className={styles.mobileOnly}>{pathname !== '/cart' && <Cart />}</div>
                <div className={styles.Bars} onClick={toggleMenu}>
                    {isActive ? <IoCloseSharp /> : <FaBars />}
                </div>
            </div>

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
        </div>
    );
}

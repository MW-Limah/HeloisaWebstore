'use client';

import { useState, useEffect } from 'react';
import styles from './NewNav.module.css';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { GrCart } from 'react-icons/gr';
import { CgProfile } from 'react-icons/cg';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoCloseSharp } from 'react-icons/io5';
import Image from 'next/image';
import Link from 'next/link';

export default function NewNav() {
    const [isMobile, setIsMobile] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <nav className={styles.navbar}>
            <section className={styles.top}>
                <Link href={'/'}>
                    <FaMagnifyingGlass />
                </Link>
                <Link href={'/cart'}>
                    <GrCart />
                </Link>
                <Link href={'/'}>
                    <CgProfile />
                </Link>
            </section>

            <section className={styles.down}>
                <aside className={styles.right}>
                    <Image src="/Logo_Mobile.png" alt="Logo da Heloisa Webstore" width={180} height={100} />
                </aside>

                <aside className={styles.left}>
                    {/* Versão Desktop */}
                    {!isMobile && (
                        <ul>
                            <li>
                                <Link href="/">Início</Link>
                            </li>
                            <li>
                                <Link href="/about">Sobre</Link>
                            </li>
                            <li>
                                <Link href="/contato">Contato</Link>
                            </li>
                            <li>
                                <Link href="/pages/Login">ADM</Link>
                            </li>
                        </ul>
                    )}

                    {/* Botão Mobile (vira X ao abrir) */}
                    {isMobile && (
                        <button className={styles.menuButton} onClick={() => setDrawerOpen(!drawerOpen)}>
                            {drawerOpen ? <IoCloseSharp size={28} /> : <GiHamburgerMenu size={28} />}
                        </button>
                    )}
                </aside>
            </section>

            {/* Drawer Mobile */}
            <nav className={`${styles.drawer} ${drawerOpen ? styles.open : ''}`}>
                <ul>
                    <li>
                        <Link href="/" onClick={() => setDrawerOpen(false)}>
                            Início
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" onClick={() => setDrawerOpen(false)}>
                            Sobre
                        </Link>
                    </li>
                    <li>
                        <Link href="/contato" onClick={() => setDrawerOpen(false)}>
                            Contato
                        </Link>
                    </li>
                    <li>
                        <Link href="/pages/Login" onClick={() => setDrawerOpen(false)}>
                            ADM
                        </Link>
                    </li>
                </ul>
            </nav>
        </nav>
    );
}

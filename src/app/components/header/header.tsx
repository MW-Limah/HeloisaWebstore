'use client';

import styles from './header.module.css';
import Banners from '@/app/components/banners/banners';

export default function Header() {
    return (
        <header className={styles.header}>
            <Banners />
        </header>
    );
}

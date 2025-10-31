'use client';

import styles from './header.module.css';
import Banners from '@/app/components/banners/banners';
import ThemeFilter from '../ThemeFilter/ThemeFilter';

export default function Header() {
    return (
        <header className={styles.header}>
            <Banners />
            <ThemeFilter
                onSelectTheme={(themeId) => {
                    console.log('Tema selecionado no Header:', themeId);
                }}
            />
        </header>
    );
}

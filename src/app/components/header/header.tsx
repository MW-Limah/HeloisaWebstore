'use client';

import SlideShow from '@/app/components/Slide/Slider'; // ajuste o caminho se necessário
import styles from './header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <SlideShow />
        </header>
    );
}

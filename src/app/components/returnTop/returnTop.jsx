'use client';
import { useEffect, useState } from 'react';
import { BiArrowToTop } from 'react-icons/bi';
import styles from './returnTop.module.css';

export default function ReturnTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 200);
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!isVisible) return null;

    return (
        <button className={styles.returnTop} onClick={scrollToTop} aria-label="Voltar ao topo">
            <BiArrowToTop />
        </button>
    );
}

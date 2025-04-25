'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './header.module.css';

const slides = [
    { id: 1, src: '/images/slide1.webp', alt: 'Slide 1' },
    { id: 2, src: '/images/slide2.webp', alt: 'Slide 2' },
    { id: 3, src: '/images/slide3.webp', alt: 'Slide 3' },
];

export default function Header() {
    const [current, setCurrent] = useState(0);
    const [imageQuality, setImageQuality] = useState<'low' | 'high'>('high');

    // Reduz qualidade se desempenho estiver baixo
    useEffect(() => {
        const start = performance.now();
        requestAnimationFrame(() => {
            const duration = performance.now() - start;
            const dpr = window.devicePixelRatio;

            if (duration > 16 || dpr <= 1) {
                setImageQuality('low');
            }
        });
    }, []);

    // Avança os slides automaticamente
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Preload do próximo slide
    useEffect(() => {
        const nextIndex = (current + 1) % slides.length;
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = slides[nextIndex].src;
        document.head.appendChild(link);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
        };
    }, [current]);

    const currentSlide = slides[current];

    return (
        <header className={styles.header}>
            <div className={styles.slider}>
                <Image
                    key={currentSlide.id}
                    src={currentSlide.src}
                    alt={currentSlide.alt}
                    fill
                    priority={current === 0}
                    sizes="(max-width: 768px) 100vw, 80vw"
                    quality={imageQuality === 'high' ? 75 : 30}
                    className={styles.image}
                />
            </div>
        </header>
    );
}

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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.slider}>
                {slides.map((slide, index) => (
                    <div key={slide.id} className={`${styles.slide} ${index === current ? styles.active : ''}`}>
                        <Image
                            src={slide.src}
                            alt={slide.alt}
                            fill
                            priority={index === 0}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={imageQuality === 'high' ? 75 : 30}
                            className={styles.image}
                        />
                    </div>
                ))}
            </div>
        </header>
    );
}

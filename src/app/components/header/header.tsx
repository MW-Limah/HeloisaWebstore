'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './header.module.css';

const slides = [
    { id: 1, src: '/images/slide1.png', alt: 'Slide 1' },
    { id: 2, src: '/images/slide2.png', alt: 'Slide 2' },
    { id: 3, src: '/images/slide3.png', alt: 'Slide 3' },
];

export default function Header() {
    const [current, setCurrent] = useState(0);
    const [imageQuality, setImageQuality] = useState<'low' | 'high'>('high');

    useEffect(() => {
        // simples detecção de desempenho e qualidade de tela
        const start = performance.now();
        requestAnimationFrame(() => {
            const duration = performance.now() - start;
            const dpr = window.devicePixelRatio;

            // Se renderização for lenta OU DPR for baixo, baixa qualidade
            if (duration > 16 || dpr <= 1) {
                setImageQuality('low');
            } else {
                setImageQuality('high');
            }
        });
    }, []);

    useEffect(() => {
        slides.forEach((slide) => {
            const img = new window.Image();
            img.src = slide.src;
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const imageSizes = {
        low: { width: 380, height: 100 },
        high: { width: 1000, height: 500 },
    };

    return (
        <header className={styles.header}>
            <div className={styles.slider}>
                {slides.map((slide, index) => (
                    <div key={slide.id} className={`${styles.slide} ${index === current ? styles.active : ''}`}>
                        <Image
                            src={slide.src}
                            alt={slide.alt}
                            width={imageSizes[imageQuality].width}
                            height={imageSizes[imageQuality].height}
                            style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                            priority={index === 0}
                        />
                    </div>
                ))}
            </div>
        </header>
    );
}

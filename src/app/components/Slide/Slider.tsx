'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Slider.module.css';

const slides = [
    {
        id: 1,
        src: '/images/slide1.png',
        alt: 'Slide 1',
        title: 'Brincos artesanais',
        subtitle: 'Feitos para refletir a beleza natural',
    },
    {
        id: 2,
        src: '/images/slide2.png',
        alt: 'Slide 2',
        title: 'Laços de cetim',
        subtitle: 'O acessório mais fofo para seus cabelos',
    },
    {
        id: 3,
        src: '/images/slide3.png',
        alt: 'Slide 3',
        title: 'Brilho labial',
        subtitle: 'Brilho inteso para seus lábios',
    },
];

export default function SlideShow() {
    const [current, setCurrent] = useState(0);
    const [imageQuality, setImageQuality] = useState<'low' | 'high'>('high');

    // Ajusta qualidade baseado no desempenho inicial
    useEffect(() => {
        const start = performance.now();
        requestAnimationFrame(() => {
            const duration = performance.now() - start;
            const dpr = window.devicePixelRatio;
            if (duration > 16 || dpr <= 1) setImageQuality('low');
        });
    }, []);

    // Avança os slides automaticamente
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const currentSlide = slides[current];

    return (
        <div className={styles.slider}>
            <div className={styles.imageWrapper}>
                <Image
                    key={currentSlide.id}
                    src={currentSlide.src}
                    alt={currentSlide.alt}
                    fill
                    priority={current === 0}
                    sizes="(max-width: 768px) 100vw, 200px"
                    quality={imageQuality === 'high' ? 75 : 30}
                    className={styles.image}
                />
            </div>
            <div className={styles.overlay}>
                <h2 className={styles.title}>{currentSlide.title}</h2>
                <p className={styles.subtitle}>{currentSlide.subtitle}</p>
            </div>
        </div>
    );
}

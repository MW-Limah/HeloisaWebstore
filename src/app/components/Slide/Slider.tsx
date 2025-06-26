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
        subtitle: 'Brilho intenso para seus lábios',
    },
];

export default function SlideShow() {
    const [current, setCurrent] = useState(0);
    const [imageQuality, setImageQuality] = useState<'low' | 'high'>('high');
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsFading(true);

            setTimeout(() => {
                setCurrent((prev) => (prev + 1) % slides.length);
                setIsFading(false);
            }, 600); // tempo do fade-out
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    // Qualidade de imagem (opcional)
    useEffect(() => {
        const start = performance.now();
        requestAnimationFrame(() => {
            const duration = performance.now() - start;
            const dpr = window.devicePixelRatio;
            if (duration > 16 || dpr <= 1) setImageQuality('low');
        });
    }, []);

    const currentSlide = slides[current];

    return (
        <div className={styles.slider}>
            <div className={styles.imageWrapper}>
                <Image
                    src={currentSlide.src}
                    alt={currentSlide.alt}
                    fill
                    priority={current === 0}
                    sizes="(max-width: 768px) 100vw, 200px"
                    quality={imageQuality === 'high' ? 75 : 30}
                    className={`${styles.image} ${isFading ? styles.fadeOut : styles.fadeIn}`}
                />
            </div>
            <div className={styles.overlay}>
                <h2 className={`${styles.title} ${isFading ? styles.fadeOut : styles.fadeIn}`}>{currentSlide.title}</h2>
                <p className={`${styles.subtitle} ${isFading ? styles.fadeOut : styles.fadeIn}`}>
                    {currentSlide.subtitle}
                </p>
            </div>
        </div>
    );
}

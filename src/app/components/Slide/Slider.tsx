'use client';

import { useEffect, useState, useRef } from 'react';
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
        title: 'Mini Ventiladores',
        subtitle: 'Fuja do calor com esse mini ventilador incrível',
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
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [current, setCurrent] = useState(0);
    const [imageQuality, setImageQuality] = useState<'low' | 'high'>('high');
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        resetInterval();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
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

    const resetInterval = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setIsFading(true);
            setTimeout(() => {
                setCurrent((prev) => (prev + 1) % slides.length);
                setIsFading(false);
            }, 600);
        }, 5000);
    };

    const currentSlide = slides[current];

    const goToPrevious = () => {
        setIsFading(true);
        setTimeout(() => {
            setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
            setIsFading(false);
        }, 300);
        resetInterval();
    };

    const goToNext = () => {
        setIsFading(true);
        setTimeout(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
            setIsFading(false);
        }, 300);
        resetInterval();
    };

    return (
        <div className={styles.container}>
            <button onClick={goToPrevious} className={styles.tulipicon} aria-label="Slide anterior">
                <Image src="/images/icons/tulip1.png" width={100} height={100} alt="Anterior" />
            </button>
            <div className={styles.sliderContainer}>
                <div className={styles.slider}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src={currentSlide.src}
                            alt={currentSlide.alt}
                            fill
                            priority={current === 0}
                            sizes="(max-width: 768px) 100vw, 250px"
                            quality={imageQuality === 'high' ? 75 : 30}
                            className={`${styles.image} ${isFading ? styles.fadeOut : ''}`}
                        />
                    </div>
                    <div className={styles.overlay}>
                        <h2 className={`${styles.title} ${isFading ? styles.fadeOut : ''}`}>{currentSlide.title}</h2>
                        <p className={`${styles.subtitle} ${isFading ? styles.fadeOut : ''}`}>
                            {currentSlide.subtitle}
                        </p>
                    </div>
                </div>
            </div>
            <button onClick={goToNext} className={styles.tulipicon} aria-label="Próximo slide">
                <Image src="/images/icons/tulip2.png" width={100} height={100} alt="Próximo" />
            </button>
        </div>
    );
}

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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.sliderContent}>
                <div className={styles.sliderWrapper}>
                    <div className={styles.slider} style={{ transform: `translateX(-${current * 100}%)` }}>
                        {slides.map((slide) => (
                            <div key={slide.id} className={styles.slide}>
                                <Image
                                    src={slide.src}
                                    alt={slide.alt}
                                    width={100}
                                    height={100}
                                    unoptimized
                                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                                    priority
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
}

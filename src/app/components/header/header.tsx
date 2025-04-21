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

    useEffect(() => {
        slides.forEach((slide) => {
            const img = new window.Image();
            img.src = slide.src;
        });
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.slider}>
                {slides.map((slide, index) => (
                    <div key={slide.id} className={`${styles.slide} ${index === current ? styles.active : ''}`}>
                        <Image
                            src={slide.src}
                            alt={slide.alt}
                            width={350}
                            height={500}
                            style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                            priority // ok para o primeiro slide
                        />
                    </div>
                ))}
            </div>
        </header>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Gallery.module.css';
import PopUpImg from './PopUpImg/PopUpImg';
import { PiMagnifyingGlassPlusBold } from 'react-icons/pi';

type GalleryProps = {
    highlighted: string;
    thumbnails: string[];
    onImageClick?: (src: string) => void;
};

export default function Gallery({ highlighted, thumbnails, onImageClick }: GalleryProps) {
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [popupSrc, setPopupSrc] = useState(highlighted);
    const [isMobile, setIsMobile] = useState(false);

    // Detecta tamanho da tela
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize(); // executa na montagem
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleOpen = (src: string) => {
        setPopupSrc(src);
        setIsPopUpOpen(true);
        onImageClick?.(src);
    };

    const filteredThumbnails = thumbnails.filter((src) => src !== highlighted);

    return (
        <div className={styles.gallery}>
            <PopUpImg src={popupSrc} isOpen={isPopUpOpen} onClose={() => setIsPopUpOpen(false)} />
            <div className={styles.SideContent}>
                <div className={styles.SideImages}>
                    {filteredThumbnails.map((src, index) => (
                        <Image
                            key={index}
                            src={src}
                            width={200}
                            height={200}
                            alt={`Miniatura ${index + 1}`}
                            onClick={() => onImageClick?.(src)}
                            className={styles.thumbnail}
                        />
                    ))}
                </div>
            </div>
            <div className={styles.ImageFocused}>
                <div className={styles.imageWrapper} onClick={() => handleOpen(highlighted)}>
                    <Image
                        src={highlighted}
                        alt="Imagem em destaque"
                        {...(isMobile ? { width: 400, height: 400 } : { fill: true })}
                        className={styles.imageResponsive}
                        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 400px, 500px"
                    />
                    <span className={styles.lupa}>
                        <PiMagnifyingGlassPlusBold />
                    </span>
                </div>
            </div>
        </div>
    );
}

'use client';

import Image from 'next/image';
import styles from './Gallery.module.css';

type GalleryProps = {
    highlighted: string;
    thumbnails: string[];
    onImageClick: (src: string, index: number) => void;
};

export default function Gallery({ highlighted, thumbnails, onImageClick }: GalleryProps) {
    return (
        <div className={styles.gridImages}>
            <div className={styles.sideImages}>
                {thumbnails.map((src, index) => (
                    <Image
                        key={index}
                        src={src}
                        width={148}
                        height={148}
                        alt={`Imagem ${index + 1}`}
                        onClick={() => onImageClick(src, index)}
                        className={`${styles.thumbnail} ${src === highlighted ? styles.active : ''}`}
                    />
                ))}
            </div>
            <div className={styles.imageFocused}>
                <Image src={highlighted} width={500} height={500} alt="Imagem em destaque" />
            </div>
        </div>
    );
}

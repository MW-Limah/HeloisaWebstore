'use client';

import Image from 'next/image';
import styles from './Gallery.module.css';

type GalleryProps = {
    highlighted: string;
    thumbnails: string[];
    onImageClick: (src: string) => void;
};

export default function Gallery({ highlighted, thumbnails, onImageClick }: GalleryProps) {
    // Filtra a imagem em foco da lista de miniaturas
    const filteredThumbnails = thumbnails.filter((src) => src !== highlighted);

    return (
        <div className={styles.gridImages}>
            <div className={styles.sideImages}>
                {filteredThumbnails.map((src, index) => (
                    <Image
                        key={index}
                        src={src}
                        width={148}
                        height={148}
                        alt={`Imagem ${index + 1}`}
                        onClick={() => onImageClick(src)}
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

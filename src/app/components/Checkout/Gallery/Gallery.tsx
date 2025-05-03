'use client';

import Image from 'next/image';
import styles from './Gallery.module.css';

type GalleryProps = {
    highlighted: string;
    thumbnails: string[];
    onImageClick: (src: string) => void;
};

export default function Gallery({ highlighted, thumbnails, onImageClick }: GalleryProps) {
    const filteredThumbnails = thumbnails.filter((src) => src !== highlighted);

    return (
        <div className={styles.gallery}>
            <div className={styles.SideContent}>
                <div className={styles.SideImages}>
                    {filteredThumbnails.map((src, index) => (
                        <Image
                            key={index}
                            src={src}
                            width={200}
                            height={200}
                            alt={`Miniatura ${index + 1}`}
                            onClick={() => onImageClick(src)}
                            className={styles.thumbnail}
                        />
                    ))}
                </div>
            </div>
            <div className={styles.ImageFocused}>
                <div className={styles.imageWrapper}>
                    <Image
                        src={highlighted}
                        alt="Imagem em destaque"
                        fill
                        className={styles.imageResponsive}
                        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 400px, 500px"
                    />
                </div>
            </div>
        </div>
    );
}

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
            <div className={styles.imageFocused}>
                <Image src={highlighted} width={500} height={500} alt="Imagem em destaque" />
            </div>
        </div>
    );
}

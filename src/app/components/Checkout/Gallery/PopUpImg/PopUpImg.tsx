'use client';

import styles from './PopUpImg.module.css';
import Image from 'next/image';
import { IoMdCloseCircle } from 'react-icons/io';

type PopUpImgProps = {
    src: string;
    isOpen: boolean;
    onClose: () => void;
};

export default function PopUpImg({ src, isOpen, onClose }: PopUpImgProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.box} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <IoMdCloseCircle size={24} />
                </button>
                <div className={styles.imageContainer}>
                    <Image src={src} width={600} height={300} alt="Imagem em pop-up" className={styles.image} />
                </div>
            </div>
        </div>
    );
}

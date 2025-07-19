'use client';

import styles from './PopUpImg.module.css';
import Image from 'next/image';
import { IoMdCloseCircle } from 'react-icons/io';
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';
import { useState, useRef } from 'react';

type PopUpImgProps = {
    src: string;
    isOpen: boolean;
    onClose: () => void;
};

export default function PopUpImg({ src, isOpen, onClose }: PopUpImgProps) {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const lastPosition = useRef({ x: 0, y: 0 });
    const dragging = useRef(false);

    const resetZoom = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
        lastPosition.current = { x: 0, y: 0 };
    };

    const zoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
    const zoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 1));

    // 🖱️ Mouse handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom <= 1) return;
        dragging.current = true;
        lastPosition.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragging.current || zoom <= 1) return;
        setPosition({
            x: e.clientX - lastPosition.current.x,
            y: e.clientY - lastPosition.current.y,
        });
    };

    const handleMouseUp = () => {
        dragging.current = false;
    };

    // 🤳 Touch handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        if (zoom <= 1) return;
        const touch = e.touches[0];
        dragging.current = true;
        lastPosition.current = {
            x: touch.clientX - position.x,
            y: touch.clientY - position.y,
        };
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!dragging.current || zoom <= 1) return;
        const touch = e.touches[0];
        setPosition({
            x: touch.clientX - lastPosition.current.x,
            y: touch.clientY - lastPosition.current.y,
        });
    };

    const handleTouchEnd = () => {
        dragging.current = false;
    };

    if (!isOpen) return null;

    return (
        <div
            className={styles.overlay}
            onClick={() => {
                onClose();
                resetZoom();
            }}
        >
            <div className={styles.box} onClick={(e) => e.stopPropagation()}>
                <button
                    className={styles.closeButton}
                    onClick={() => {
                        onClose();
                        resetZoom();
                    }}
                >
                    <IoMdCloseCircle size={24} />
                </button>

                <div className={styles.controls}>
                    <button onClick={zoomOut} disabled={zoom <= 1}>
                        <AiOutlineZoomOut size={24} />
                    </button>
                    <button onClick={zoomIn} disabled={zoom >= 3}>
                        <AiOutlineZoomIn size={24} />
                    </button>
                </div>

                <div
                    className={styles.imageContainer}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className={styles.zoomWrapper}
                        style={{
                            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                            transformOrigin: 'center center',
                            cursor: zoom > 1 ? 'grab' : 'default',
                        }}
                    >
                        <Image
                            src={src}
                            width={600}
                            height={300}
                            alt="Imagem em pop-up"
                            className={styles.image}
                            draggable={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

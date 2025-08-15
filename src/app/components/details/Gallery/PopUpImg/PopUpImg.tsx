'use client';

import styles from './PopUpImg.module.css';
import Image from 'next/image';
import { IoMdCloseCircle } from 'react-icons/io';
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';
import { useState, useRef, useEffect } from 'react';
import Loading from '@/app/components/Loading/Loading';

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
    const [loading, setLoading] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            resetZoom();
        }
    }, [src, isOpen]);

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
        e.preventDefault();
        setPosition({
            x: e.clientX - lastPosition.current.x,
            y: e.clientY - lastPosition.current.y,
        });
    };

    const handleMouseUp = () => {
        dragging.current = false;
    };

    // 📱 Touch handlers (não passivos)
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTouchStart = (e: TouchEvent) => {
            if (zoom <= 1) return;
            const touch = e.touches[0];
            dragging.current = true;
            lastPosition.current = {
                x: touch.clientX - position.x,
                y: touch.clientY - position.y,
            };
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!dragging.current || zoom <= 1) return;
            e.preventDefault(); // agora permitido
            const touch = e.touches[0];
            setPosition({
                x: touch.clientX - lastPosition.current.x,
                y: touch.clientY - lastPosition.current.y,
            });
        };

        const handleTouchEnd = () => {
            dragging.current = false;
        };

        // ✅ Registrando com passive: false
        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [zoom, position.x, position.y]);

    if (!isOpen) return null;

    const handleImageLoad = () => {
        setLoading(false);
    };

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
                {loading && (
                    <div className={styles.loadingOverlay}>
                        <Loading />
                    </div>
                )}

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
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
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
                            onLoadingComplete={handleImageLoad}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import styles from './banners.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function Banners() {
    const [slidesPerView, setSlidePerView] = useState(2);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 720) {
                setSlidePerView(1);
            } else {
                setSlidePerView(2);
            }
        } // Define a quantidade de slides que aparecem na tela, de acordo com o seu tamanho

        handleResize();

        window.addEventListener('resize', handleResize); // Cria um listener para montar sempre que a tela for redimensionanada
        return () => window.removeEventListener('resize', handleResize); // desliga o listener quando o componente for desmontado
    }, []);

    const data = [
        { id: 1, image: '/images/banners/banner1.png', alt: 'Banner 1' },
        { id: 2, image: '/images/banners/banner2.png', alt: 'Banner 2' },
        { id: 3, image: '/images/banners/banner3.png', alt: 'Banner 3' },
        { id: 4, image: '/images/banners/banner4.jpg', alt: 'Banner 4' },
    ];

    return (
        <div className={styles.banners}>
            <Swiper
                slidesPerView={slidesPerView}
                pagination={{ clickable: true }}
                navigation={true}
                className={styles.mySwiper}
                loop={true}
            >
                {data.map((item) => (
                    <SwiperSlide key={item.id}>
                        <img src={item.image} alt={item.alt} className={styles.sliderItems} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

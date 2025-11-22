'use client';

import { useState, useEffect } from 'react';
import styles from './banners.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function Banners() {
    const data = [
        {
            id: 1,
            image: '/images/banners/banner1.png',
            alt: 'Banner 1',
            link: '/checkout/76f26891-4a73-45e8-8be9-d2344d69c594',
        },
        {
            id: 2,
            image: '/images/banners/banner2.png',
            alt: 'Banner 2',
            link: '/checkout/76f26891-4a73-45e8-8be9-d2344d69c594',
        },
        {
            id: 3,
            image: '/images/banners/banner3.png',
            alt: 'Banner 3',
            link: '/checkout/9a1db769-2475-4610-9574-1d628d9ae870',
        },
    ];

    return (
        <div className={styles.banners}>
            <Swiper
                slidesPerView={1}
                pagination={{ clickable: true, type: 'bullets' }}
                navigation={true}
                className={styles.mySwiper}
                loop={true}
                autoplay={{ delay: 5000 }}
            >
                {data.map((item) => (
                    <SwiperSlide key={item.id}>
                        <a href={item.link}>
                            <img src={item.image} alt={item.alt} className={styles.sliderItems}></img>
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

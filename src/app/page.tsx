'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import ReturnTop from './components/returnTop/returnTop';
/* import Navbar from './components/navbar/navbar'; */
import NewNav from './components/NewNav/NewNav';
import Header from './components/header/header';
import Main from './components/main/main';
import Footer from './components/footer/footer';

import { register } from 'swiper/element/bundle';

register();
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function Home() {
    const [visits, setVisits] = useState<number | null>(null);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem('welcomeDismissed') === 'true';
        if (!dismissed) {
            setShowWelcome(true);
        }
    }, []);

    const handleDismiss = () => {
        setShowWelcome(false);
        localStorage.setItem('welcomeDismissed', 'true');
    };

    useEffect(() => {
        fetch(`/api/visits?t=${Date.now()}`, {
            cache: 'no-store',
            next: { revalidate: 0 },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('🛰️ /api/visits retornou:', data);
                setVisits(data.count);
            })
            .catch((err) => console.error('Erro ao buscar visitas', err));
    }, []);

    return (
        <>
            <div className={styles.visitsContainer}>
                <p>Visitas: {visits ?? '...'}</p>
            </div>
            <div>
                <ReturnTop />
            </div>
            {/* <Navbar /> */}
            <NewNav />
            <Header />
            <Main />
            <Footer />
        </>
    );
}

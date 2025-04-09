'use client';
import styles from './lineMenu.module.css';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

const items = [...Array(8).keys()]; // [0, 1, 2, ..., 7]

export default function LineMenu() {
    const scrollRef = useRef(null);
    const itemWidth = 400; // valor estimado (ajuste conforme necessário)

    // Função para ir para esquerda
    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        }
    };

    // Função para ir para direita
    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
    };

    // Efeito para ajustar a posição inicial
    useEffect(() => {
        const scrollEl = scrollRef.current;
        if (scrollEl) {
            const middle = scrollEl.scrollWidth / 5;
            scrollEl.scrollLeft = middle;
        }
    }, []);

    // Efeito para detectar quando "passa" do fim/início
    const handleScroll = () => {
        const scrollEl = scrollRef.current;
        if (!scrollEl) return;

        const totalWidth = scrollEl.scrollWidth;
        const oneThird = totalWidth / 3;

        if (scrollEl.scrollLeft <= 0) {
            // foi muito para a esquerda, volta para o centro
            scrollEl.scrollLeft = oneThird;
        } else if (scrollEl.scrollLeft >= oneThird * 2) {
            // foi muito para a direita, volta para o centro
            scrollEl.scrollLeft = oneThird;
        }
    };

    return (
        <section className={styles.LineMenu}>
            <button onClick={scrollLeft} className={styles.NavButton}>
                <Image src={'/images/lineMenu/tulipinha.png'} width={80} height={200} alt="Scroll Left" />
            </button>

            <div className={styles.LineScrollContainer} ref={scrollRef} onScroll={handleScroll}>
                <div className={styles.LineScroll}>
                    {/* Clones à esquerda */}
                    {items.map((i) => (
                        <div className={styles.LineItem} key={`left-${i}`}>
                            <Image
                                src={`/images/lineMenu/itens/item${i + 1}.jpg`}
                                width={300}
                                height={300}
                                alt={`Item ${i}`}
                            />
                        </div>
                    ))}

                    {/* Itens Reais */}
                    {items.map((i) => (
                        <div className={styles.LineItem} key={`main-${i}`}>
                            <Image
                                src={`/images/lineMenu/itens/item${i + 1}.jpg`}
                                width={300}
                                height={300}
                                alt={`Item ${i}`}
                            />
                        </div>
                    ))}

                    {/* Clones à direita */}
                    {items.map((i) => (
                        <div className={styles.LineItem} key={`right-${i}`}>
                            <Image
                                src={`/images/lineMenu/itens/item${i + 1}.jpg`}
                                width={300}
                                height={300}
                                alt={`Item ${i}`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={scrollRight} className={styles.NavButton}>
                <Image src={'/images/lineMenu/tulipinhaInv.png'} width={80} height={200} alt="Scroll Right" />
            </button>
        </section>
    );
}

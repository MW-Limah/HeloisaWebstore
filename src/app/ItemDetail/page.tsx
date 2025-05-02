import styles from './ItemDetail.module.css';
import JustTop from '../components/nav/justTop';
import Image from 'next/image';

export default function ItemDetail() {
    return (
        <div className={styles.container}>
            <JustTop />
            <div className={styles.content}>
                <div className={styles.gallery}>
                    <div className={styles.SideImages}>
                        <Image src={'/images/lineMenu/itens/item1.jpg'} width={100} height={100} alt="Image"></Image>
                        <Image src={'/images/lineMenu/itens/item1.jpg'} width={100} height={100} alt="Image"></Image>
                        <Image src={'/images/lineMenu/itens/item1.jpg'} width={100} height={100} alt="Image"></Image>
                    </div>
                    <div className={styles.ImageFocused}>
                        <Image src={'/images/lineMenu/itens/item1.jpg'} width={320} height={320} alt="Image"></Image>
                    </div>
                </div>
                <div className={styles.comments}>
                    <div className={styles.title}>
                        <h2>Comentários</h2>
                    </div>
                    <div className={styles.commentsTexts}>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <div key={num}>
                                <h3>Pessoa {num}</h3>
                                <p>este produto é incrível!</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.checkoutform}></div>
            </div>
        </div>
    );
}

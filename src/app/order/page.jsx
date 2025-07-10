import styles from './order.module.css';
import JustTop from '../components/nav/justTop';

export default function OrderPage() {
    return (
        <div className={styles.container}>
            <JustTop />
            <div className={styles.content}></div>
        </div>
    );
}

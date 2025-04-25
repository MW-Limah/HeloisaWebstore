import Link from 'next/link';
import styles from './GoCart.module.css';
import { PiShoppingCartLight } from 'react-icons/pi';

export default function GoCart() {
    return (
        <div className={styles.GoCart}>
            <Link href={'/cart'}>
                Ver Carrinho <PiShoppingCartLight className={styles.GoCartIcon} />
            </Link>
        </div>
    );
}

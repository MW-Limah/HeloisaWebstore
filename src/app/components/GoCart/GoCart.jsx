import Link from 'next/link';
import styles from './GoCart.module.css';
import { PiShoppingCartFill } from 'react-icons/pi';

export default function GoCart() {
    return (
        <div className={styles.GoCart}>
            <Link className={styles.GoCartlink} href={'/cart'}>
                Carrinho <PiShoppingCartFill className={styles.GoCartIcon} />
            </Link>
        </div>
    );
}

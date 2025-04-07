import styles from './navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.topContent}>
                <div className={styles.leftContent}>
                    <Image src={'/logo_1.png'} width={100} height={100} alt="Logo Principal Heloisa Moda Feminina" />
                </div>
                <div className={styles.rightContent}>
                    <Link href={'#'}>Olá, inscreva-se para atualizações</Link>
                    <Link href={'#'}>Entre em contato!</Link>
                </div>
            </div>
            <div className={styles.bottomContent}>
                <ul>
                    <li>
                        <Link href={'#'}>Todos</Link>
                    </li>
                    <li>
                        <Link href={'#'}>Prendedores de cabelo</Link>
                    </li>
                    <li>
                        <Link href={'#'}>Maquiagem</Link>
                    </li>
                    <li>
                        <Link href={'#'}>Brincos</Link>
                    </li>
                    <li>
                        <Link href={'#'}>Pulseiras</Link>
                    </li>
                    <li>
                        <Link href={'#'}>Anéis</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

/* export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.leftContent}>
                <Image src={'/logo_1.png'} width={100} height={100} alt="Logo Principal Heloisa Moda Feminina" />
            </div>
            <div className={styles.rightContent}>
                <Link href={'#'}>Olá, inscreva-se aqui para obter atualizações</Link>
                <Link href={'#'}>Entre em contato!</Link>
            </div>
        </nav>
    );
} */

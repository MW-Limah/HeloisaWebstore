import styles from './footer.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { RiInstagramFill } from 'react-icons/ri';
import { IoLogoWhatsapp } from 'react-icons/io';
import { FaPinterest } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.containerImg}>
                <Image src="/logo_2.png" width={100} height={100} alt="Logo" />
            </div>
            <div className={styles.container}>
                <ul className={styles.fstBox}>
                    <h2>Quem sou eu</h2>
                    <p>
                        Sou uma empreendedora dedicada e cativada pela beleza e autenticidade. Cada acessório aqui foi
                        selecionado com carinho para valorizar a beleza da simplicidade a sua personalidade
                    </p>
                </ul>
                <ul className={styles.sdBox}>
                    <h2>Mapa do site</h2>
                    <li>
                        <Link href={'#Início'}>Início</Link>
                    </li>
                    <li>
                        <Link href={'#'}>Promoções</Link>
                    </li>
                    <li>
                        <Link href={'#'}>Inscreva-se</Link>
                    </li>
                </ul>
                <ul className={styles.sdBox}>
                    <h2>Suporte</h2>
                    <li>
                        <Link href={'#'}>Contate-nos</Link>
                    </li>
                    <li>
                        <Link href={'/termos-de-uso'}>Termos de Uso</Link>
                    </li>
                    <li>
                        <Link href={'#'}>Perguntas Frequentes</Link>
                    </li>
                </ul>
                <div className={styles.containerSocial}>
                    <ul>
                        <h3>Redes Sociais</h3>
                        <div className={styles.redesSociais}>
                            <IoLogoWhatsapp />
                            <RiInstagramFill />
                            <FaPinterest />
                        </div>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

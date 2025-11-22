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
                <Image src="/Logo_SD.png" width={250} height={80} alt="Logo Para Footer" />
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
                        <Link href={'/cart'}>Seu carrinho de compras</Link>
                    </li>
                    {/* <li>
                        <Link href={'#'}>Inscreva-se</Link>
                    </li> */}
                </ul>
                <ul className={styles.sdBox}>
                    <h2>Suporte</h2>
                    <li>
                        <Link href={'/contato'}>Contate-nos</Link>
                    </li>
                    <li>
                        <Link href={'/termos-de-uso'}>Termos de Uso</Link>
                    </li>
                </ul>

                <ul className={styles.sdboxRedes}>
                    <h2>Redes Sociais</h2>
                    <div className={styles.redes}>
                        <a href="https://api.whatsapp.com/send/?phone=559299875435&text=Ol%C3%A1+tenho+interesse+nesse+produto%3A+TITULOAQUI&type=phone_number&app_absent=0">
                            <IoLogoWhatsapp />
                        </a>
                        <a>
                            <FaPinterest />
                        </a>
                        <a href={'https://www.instagram.com/hanel.h.h/'} target="_blank" rel="noopener noreferrer">
                            <RiInstagramFill />
                        </a>
                    </div>
                </ul>
            </div>
        </footer>
    );
}

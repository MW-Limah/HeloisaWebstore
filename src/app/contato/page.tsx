import styles from './contato.module.css';
import JustTop from '@/app/components/nav/justTop';
import { RiInstagramFill } from 'react-icons/ri';
import { IoLogoWhatsapp } from 'react-icons/io';
import { FaPinterest } from 'react-icons/fa';

export default function Contato() {
    return (
        <div className={styles.container}>
            <JustTop />
            <div className={styles.content}>
                {/* Formulário de e-mail */}
                <div className={styles.form}>
                    <h2>Nos envie um e-mail</h2>
                    <form action="">
                        <div className={styles.name}>
                            <input type="text" placeholder="Seu nome" required />
                            <input type="text" placeholder="Sobrenome" required />
                        </div>
                        <input type="email" placeholder="E-mail" required />
                        <h3>Mensagem</h3>
                        <textarea name="" id=""></textarea>
                        <p>Por favor, seja educado.</p>
                    </form>
                </div>
                {/* Detalhes de contato */}
                <div className={styles.info}>
                    <h2>Detalhes de contato</h2>
                    <h3>E-mail</h3>
                    <p>loja.heloisaofc@gmail.com</p>
                    <h3>Redes Sociais</h3>
                    <div className={styles.redesSociais}>
                        <ul>
                            <li>
                                <IoLogoWhatsapp /> 91 1234-5678
                            </li>
                            <li>
                                <FaPinterest /> @heloisaofc
                            </li>
                            <li>
                                <RiInstagramFill /> <a href="https://www.instagram.com/hanel.h.h/">hanel.h.h</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

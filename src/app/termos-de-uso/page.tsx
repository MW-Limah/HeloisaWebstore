// pages/termos-de-uso.tsx
import styles from './termos.module.css';
import Head from 'next/head';
import Footer from '../components/footer/footer';
import { FaPix } from 'react-icons/fa6';
import { TbArrowBackUp } from 'react-icons/tb';
import Link from 'next/link';

export default function TermosDeUso() {
    return (
        <>
            <Head>
                <title>Termos de Uso - Heloisa Moda Feminina</title>
            </Head>

            <div className={styles.container}>
                <div className={styles.headerTermos}>
                    <h4>
                        <Link href="/">
                            Voltar à página principal <TbArrowBackUp className={styles.back} />
                        </Link>
                    </h4>
                    <h4>Atualizado em 15/04/2025</h4>
                </div>
                <h1>Termos de Uso - Heloisa Moda Feminina</h1>

                <p>
                    Bem-vinda(o) à Heloisa Moda Feminina! Antes de realizar suas compras, pedimos que leia atentamente
                    nossos Termos de Uso. Ao utilizar este site e realizar uma compra, você concorda com as condições
                    abaixo.
                </p>

                <h2>1. Sobre a Loja</h2>
                <p>
                    A Heloisa Moda Feminina é uma loja virtual dedicada à venda de acessórios para cabelo (como
                    piranhas, laços e pompoms), maquiagens (batons, esponjas, sombras, etc.) e joias/bijuterias (anéis,
                    pulseiras, cordões). Todos os produtos são escolhidos com carinho para valorizar sua beleza e
                    estilo!
                </p>

                <h2>2. Responsável Legal</h2>
                <p>
                    A loja é gerenciada por uma empreendedora individual e, no momento, não possui CNPJ. Todas as vendas
                    são feitas com responsabilidade e comprometimento.
                </p>

                <h2>3. Formas de Pagamento</h2>
                <p>Atualmente, aceitamos:</p>
                <ul>
                    <li>
                        Pix <FaPix />
                    </li>
                    <li>Transferência bancária</li>
                </ul>
                <p>Em breve, também passaremos a aceitar cartões de débito.</p>

                <h2>4. Entregas</h2>
                <p>
                    As entregas são realizadas exclusivamente na cidade de Manaus - AM, com prazo estimado entre 1 a 3
                    dias úteis, dependendo da localização.
                </p>

                <h2>5. Trocas e Devoluções</h2>
                <p>
                    Aceitamos devoluções em até 7 dias corridos após o recebimento do produto, conforme previsto no
                    Código de Defesa do Consumidor.
                </p>
                <p>Aceitamos trocas nos seguintes casos:</p>
                <ul>
                    <li>Produto veio com defeito de fábrica</li>
                    <li>Produto errado foi enviado</li>
                    <li>Produto errado foi comprado (caso o cliente deseje trocar)</li>
                    <li>Produto não chegou ao destino</li>
                </ul>
                <p>
                    Em qualquer um desses casos o cliente pode pedir um novo produto de mesmo valor ou ser ressarcido.
                </p>

                <h2>6. Cancelamentos e Reembolsos</h2>
                <p>O cancelamento deve ser solicitado em até 24 horas após a compra.</p>
                <p>
                    Para reembolsos, entre em contato diretamente conosco com o recibo ou comprovante de pagamento em
                    mãos.
                </p>

                <h2>7. Atendimento</h2>
                <p>Você pode falar conosco através dos nossos canais oficiais:</p>
                <ul>
                    <li>
                        Instagram:{' '}
                        <a href="https://instagram.com/hanel.h.h" target="_blank">
                            @hanel.h.h
                        </a>
                    </li>
                    <li>E-mail e WhatsApp: disponibilizados em nossa página de contato e no rodapé da página.</li>
                </ul>

                <h2>8. Privacidade e Proteção de Dados</h2>
                <p>
                    As informações fornecidas pelos clientes, como nome, endereço e dados de contato, são utilizadas
                    exclusivamente para processar pedidos, efetuar entregas e prestar um melhor atendimento. Garantimos
                    a confidencialidade desses dados e não realizamos compartilhamento com terceiros sem sua
                    autorização.
                </p>

                <p>
                    <strong>Importante:</strong> Nunca vamos entrar em contato utilizando outros meios e dados que não
                    os fornecidos nesse site. Sempre certifique-se de estar falando diretamente conosco. <br />
                    <b>
                        Qualquer suspeita ou dúvida, entrar em contato diretamente com os administradores, utilizando os
                        meios de contatos fornecidos na página de contato e rodapé.
                    </b>
                </p>

                <h2>9. Alterações nos Termos</h2>
                <p>
                    Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento, sendo as alterações
                    publicadas nesta página. O uso contínuo da loja após tais mudanças constitui aceitação dos novos
                    termos.
                </p>

                <h2>10. Limitação de Responsabilidade</h2>
                <p>
                    A Heloisa Moda Feminina não se responsabiliza por danos ou prejuízos resultantes do uso incorreto
                    dos produtos adquiridos. Recomendamos sempre a leitura de instruções e cuidados de uso, quando
                    aplicáveis.
                </p>

                <h2>11. Propriedade Intelectual</h2>
                <p>
                    Todas as imagens, descrições e conteúdos exibidos na loja são de uso exclusivo da Heloisa Moda
                    Feminina. É proibida a reprodução, distribuição ou modificação sem autorização expressa da loja.
                </p>
            </div>

            <Footer />
        </>
    );
}

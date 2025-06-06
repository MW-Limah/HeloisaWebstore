'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import JustTop from '../components/nav/justTop';
import styles from './perfil.module.css';
import Image from 'next/image';
import { FaRegEdit } from 'react-icons/fa';
import { TbArrowBackUp } from 'react-icons/tb';

export default function PerfilPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');

    // Redirect to login if not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/pages/Login');
        }
    }, [status, router]);

    // Fetch profile using NextAuth session EMAIL (não ID)
    useEffect(() => {
        if (!session?.user?.email) {
            console.warn('session.user.email não definido');
            return;
        }

        const fetchProfile = async () => {
            console.log('Buscando perfil para email:', session.user.email);

            // Busca o perfil pelo email, não pelo id
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('nome, email, id')
                .eq('email', session.user.email)
                .single();

            if (error) {
                console.error('Erro ao buscar perfil:', error.message);
                return;
            }

            if (!profile) {
                console.error('Perfil não encontrado para email:', session.user.email);
                return;
            }

            setId(profile.id);
            setNome(profile.nome);
            setEmail(profile.email);
        };

        fetchProfile();
    }, [session?.user?.email]);

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/');
    };

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <JustTop />
            </div>
            <div className={styles.content}>
                <aside className={styles.profile}>
                    <div className={styles.quitPanel}>
                        <button className={styles.buttonOut} onClick={handleSignOut}>
                            Sair <TbArrowBackUp className={styles.back} />
                        </button>
                    </div>
                    <div className={styles.SelectedImg}>
                        <Image src="/perfil.png" width={100} height={100} alt="Sua foto de perfil" />
                    </div>
                    <div className={styles.sectionSelectImg}>
                        <label htmlFor="fupload" className={styles.selectImg}>
                            Mudar foto
                            <FaRegEdit className={styles.icon} />
                        </label>
                        <input type="file" id="fupload" className={styles.formUp} />
                    </div>
                    <div>
                        <h3>Total de compras</h3>
                    </div>
                </aside>
                <aside className={styles.infos}>
                    <h1>Meu perfil</h1>
                    <div className={styles.dadosPessoais}>
                        <div className={styles.dataGroup}>
                            <label>Nome</label>
                            <input type="text" value={nome} readOnly />
                        </div>

                        <div className={styles.dataGroup}>
                            <label>Email</label>
                            <input type="text" value={email} readOnly />
                        </div>

                        <div className={styles.dataGroup}>
                            <label>Telefone</label>
                            <input type="text" readOnly />
                        </div>

                        <div className={styles.dataGroup}>
                            <label>ID do Usuário</label>
                            <input type="text" value={id} readOnly />
                        </div>
                        <div className={styles.dataGroup}>
                            <label>Senha</label>
                            <input type="password" readOnly />
                        </div>
                        <div className={styles.dataGroup}>
                            <label>Nova senha</label>
                            <input type="password" readOnly />
                        </div>
                    </div>
                    <div className={styles.btnContainer}>
                        <button>Editar dados</button>
                        <button>Salvar nova senha</button>
                    </div>
                </aside>
            </div>
        </div>
    );
}

'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from './perfil.module.css';
import Image from 'next/image';
import { FaRegEdit } from 'react-icons/fa';

import JustTop from '../components/nav/justTop';

export default function PerfilPage() {
    const [userData, setUserData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchProfile() {
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push('/');
                return;
            }

            const { data, error } = await supabase.from('clients').select('*').eq('id', user.id).single();

            if (error) {
                setError(error.message);
            } else {
                setUserData(data);
            }
        }

        fetchProfile();
    }, []);

    if (!userData) {
        return <p className={styles.loading}>Carregando...</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.buttonBack}>
                <JustTop />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.content}>
                <aside className={styles.profile}>
                    <div className={styles.SelectedImg}>
                        <Image src={'/perfil.png'} width={100} height={100} alt="Sua foto de perfil"></Image>
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
                        <div>box</div>
                    </div>
                </aside>
                <aside className={styles.infos}>
                    <h1>Meu perfil</h1>
                    <div className={styles.dadosPessoais}>
                        <div className={styles.dataGroup}>
                            <label>Nome</label>
                            <input type="text" value={userData.first_name} readOnly />
                        </div>
                        <div className={styles.dataGroup}>
                            <label>Sobrenome</label>
                            <input type="text" value={userData.last_name} readOnly />
                        </div>
                        <div className={styles.dataGroup}>
                            <label>Email</label>
                            <input type="text" value={userData.email} readOnly />
                        </div>
                        <div className={styles.dataGroup}>
                            <label>Telefone</label>
                            <input type="text" value={userData.phone} readOnly />
                        </div>

                        {/* <div className={styles.dataGroup}>
                            <label>ID do Usuário</label>
                            <input type="text" value={userData.id} readOnly />
                        </div> */}

                        <div className={styles.dataGroup}>
                            <label>Senha</label>
                            <input type="password" value={userData.password} readOnly />
                        </div>
                        <div className={styles.dataGroup}>
                            <label>Nova senha</label>
                            <input type="password" value={userData.password} readOnly />
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

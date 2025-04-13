'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import styles from './BoxForm.module.css';

// (Opcional) Função para sanitizar o nome do arquivo – remova acentos, espaços e caracteres especiais, se necessário
function sanitizeFileName(fileName: string): string {
    return fileName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9\-_.]/g, '');
}

export default function BoxForm() {
    const [title, setTitle] = useState('');
    const [theme, setTheme] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const filesArray = Array.from(e.target.files).slice(0, 4); // no máximo 4 imagens
        setImages(filesArray);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            const imageUrls: string[] = [];

            // Faz o upload das imagens e gera as URLs públicas
            for (const file of images) {
                // Se desejar, use sanitizeFileName para o nome do arquivo:
                // const safeFileName = sanitizeFileName(file.name);
                // Inclua o diretório "public/" no caminho
                const filePath = `public/${Date.now()}-${file.name}`;
                const { data, error } = await supabase.storage.from('box-items').upload(filePath, file);

                if (error) throw error;

                const { data: publicUrlData } = supabase.storage.from('box-items').getPublicUrl(filePath);

                imageUrls.push(publicUrlData.publicUrl); // Adiciona a URL pública ao array
            }

            // Inserindo os dados na tabela 'box-items'
            const { error: insertError } = await supabase.from('box-items').insert([
                {
                    title,
                    theme,
                    description,
                    images: imageUrls,
                },
            ]);

            if (insertError) throw insertError;

            alert('Item criado com sucesso!');
            setTitle('');
            setTheme('');
            setDescription('');
            setImages([]);
        } catch (err: any) {
            console.error('Erro ao salvar:', err.message);
            alert('Erro ao salvar item.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input
                type="text"
                placeholder="Tema (único)"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                required
            />
            <textarea placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="file" accept="image/*" multiple onChange={handleImageChange} />
            {images.length > 0 && <p>{images.length} imagem(ns) selecionada(s)</p>}
            <button type="submit" disabled={uploading}>
                {uploading ? 'Enviando...' : 'Salvar'}
            </button>
        </form>
    );
}

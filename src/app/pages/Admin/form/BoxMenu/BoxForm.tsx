'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import styles from './BoxForm.module.css';

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
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selectedFiles = Array.from(e.target.files);
        const newFiles = [...images, ...selectedFiles].slice(0, 4); // junta e limita a 4
        setImages(newFiles);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (images.length === 0) {
            alert('Envie pelo menos uma imagem!');
            return;
        }

        setUploading(true);

        try {
            const imageUrls: string[] = [];

            for (const file of images) {
                const safeFileName = sanitizeFileName(file.name);
                const filePath = `public/${Date.now()}-${safeFileName}`;

                const { error: uploadError } = await supabase.storage.from('box-items').upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage.from('box-items').getPublicUrl(filePath);

                imageUrls.push(publicUrlData.publicUrl);
            }

            const { error: insertError } = await supabase.from('box-items').insert([
                {
                    title,
                    theme,
                    price,
                    description,
                    images: imageUrls,
                },
            ]);

            if (insertError) throw insertError;

            alert('Item criado com sucesso!');
            setTitle('');
            setTheme('');
            setPrice('');
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

            <input type="file" accept="image/*" multiple onChange={handleImageChange} required={images.length === 0} />
            {images.length > 0 && <p>{images.length} imagem(ns) selecionada(s)</p>}

            <input type="text" placeholder="Preço" value={price} onChange={(e) => setPrice(e.target.value)} required />

            <textarea placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />

            <button type="submit" disabled={uploading}>
                {uploading ? 'Enviando...' : 'Salvar'}
            </button>
        </form>
    );
}

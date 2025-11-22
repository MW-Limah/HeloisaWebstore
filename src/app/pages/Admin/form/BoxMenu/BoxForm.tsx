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

interface BoxFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BoxForm({ isOpen, onClose }: BoxFormProps) {
    const [title, setTitle] = useState('');
    const [theme, setTheme] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [colors, setColors] = useState('');
    const [quantities, setQuantities] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selectedFiles = Array.from(e.target.files);
        const newFiles = [...images, ...selectedFiles].slice(0, 8);
        setImages(newFiles);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (images.length === 0) {
            alert('Envie pelo menos uma imagem!');
            return;
        }

        if (!colors.trim() || !quantities.trim()) {
            alert('Preencha as cores e quantidades corretamente!');
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

            const colorsArray = colors.split(',').map((color) => color.trim());
            const quantitiesArray = quantities.includes(',')
                ? quantities.split(',').map((qty) => parseInt(qty.trim(), 10))
                : Array.from({ length: parseInt(quantities.trim(), 10) }, (_, i) => i + 1);

            const { error: insertError } = await supabase.from('box-items').insert([
                {
                    title,
                    theme,
                    price,
                    description,
                    images: imageUrls,
                    colors: colorsArray,
                    quantities: quantitiesArray,
                },
            ]);

            if (insertError) throw insertError;

            alert('Item criado com sucesso!');
            setTitle('');
            setTheme('');
            setPrice('');
            setDescription('');
            setImages([]);
            setColors('');
            setQuantities('');
            onClose();
        } catch (err: any) {
            console.error('Erro ao salvar:', err.message);
            alert('Erro ao salvar item.');
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    ×
                </button>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h3>Adicione o conteúdo da sua caixinha</h3>
                    <input
                        type="text"
                        placeholder="Título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <select
                        className={styles.selectionTheme}
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        required
                    >
                        <option value="">Selecione um tema</option>
                        <option value="piranhas">Piranhas</option>
                        <option value="brincos">Brincos</option>
                        <option value="cordoes">Cordões</option>
                        <option value="pulseiras">Pulseiras</option>
                        <option value="aneis">Anéis</option>
                        <option value="maquiagens">Maquiagens</option>
                        <option value="lacos">Laços</option>
                        <option value="eletronicos">Eletrônicos</option>
                        <option value="homestuffs">Casa e decoração</option> {/* Nova categoria */}
                    </select>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        required={images.length === 0}
                    />
                    {images.length > 0 && <p>{images.length} imagem(ns) selecionada(s)</p>}
                    <input
                        type="text"
                        placeholder="Preço"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Descrição"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Cores disponíveis (Separe as cores por vírgula, ex: Vermelho, Azul)"
                        value={colors}
                        onChange={(e) => setColors(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Quantidades disponíveis (Coloque o apenas número total disponível ex: 4)"
                        value={quantities}
                        onChange={(e) => setQuantities(e.target.value)}
                    />

                    <button type="submit" disabled={uploading}>
                        {uploading ? 'Enviando...' : 'Salvar'}
                    </button>
                </form>
            </div>
        </div>
    );
}

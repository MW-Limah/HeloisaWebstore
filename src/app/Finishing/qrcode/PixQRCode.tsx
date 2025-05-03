// src/app/Finishing/qrcode/PixQRCode.tsx
'use client';

import { useMemo } from 'react';
import { payload } from 'pix-payload'; // :contentReference[oaicite:0]{index=0}
import { QRCodeSVG } from 'qrcode.react';

interface PixQRCodeProps {
    chave: string;
    nome: string;
    cidade: string;
    valor: number;
    txid?: string;
}

export default function PixQRCode({ chave, nome, cidade, valor, txid = 'TX12345678' }: PixQRCodeProps) {
    const pixPayload = useMemo(() => {
        // 1. Maiúsculas, remover acentos e pontuação
        const normalize = (str: string) =>
            str
                .toUpperCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^A-Z0-9 ]/g, '');

        const nName = normalize(nome);
        const nCity = normalize(cidade);
        const nTxid = normalize(txid); // remove hífens/pontos

        // 2. Garantir duas casas decimais
        const nAmount = Number(valor).toFixed(2);

        return payload({
            key: chave,
            name: nName,
            city: nCity,
            amount: parseFloat(nAmount),
            transactionId: nTxid,
        });
    }, [chave, nome, cidade, valor, txid]);

    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Escaneie o QR Code para pagar</h2>
            <QRCodeSVG value={pixPayload} size={256} />
        </div>
    );
}

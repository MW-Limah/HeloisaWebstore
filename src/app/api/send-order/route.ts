// /app/api/send-order/route.ts
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!); // Configure no .env.local

export async function POST(req: Request) {
    const data = await req.json();

    const { id, title, quantity, color, price, total, image, firstName, lastName, email, phone, message } = data;

    try {
        const msg = {
            to: 'loja.heloisaofc@gmail.com', // Altere para seu email real
            from: 'Pedidos <mwlima.dev@gmail.com>', // Deve ser um remetente verificado no SendGrid
            subject: `Nova reserva para ${firstName} ${lastName}`,
            html: `
                <h2>Informações do Produto</h2>
                <p><strong>Produto:</strong> ${title}</p>
                <p><strong>Código:</strong> ${id}</p>
                <p><strong>Quantidade:</strong> ${quantity}</p>
                <p><strong>Cor:</strong> ${color}</p>
                <p><strong>Valor unitário:</strong> R$ ${Number(price).toFixed(2).replace('.', ',')}</p>
                <p><strong>Total:</strong> R$ ${total.replace('.', ',')}</p>
                <img src="${image}" width="200" alt="Imagem do produto" />

                <h2>Cliente</h2>
                <p><strong>Nome:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${phone}</p>
                <p><strong>Mensagem:</strong> ${message}</p>
            `,
        };

        await sgMail.send(msg);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Erro ao enviar email:', err.response?.body || err.message);
        return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 });
    }
}

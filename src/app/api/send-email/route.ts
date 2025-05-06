// src/app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
    const data = await request.json();
    console.log('[send-email] received:', data);

    const htmlBody = `
    <h1>Novo Pedido (${data.paymentMethod.toUpperCase()})</h1>
    <p><strong>Nome:</strong> ${data.first_name} ${data.last_name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Total:</strong> R$ ${data.total}</p>
    ${data.pixCode ? `<p><strong>Pix Code:</strong> ${data.pixCode}</p>` : ''}
    ${data.boletoUrl ? `<p><strong>Boleto URL:</strong> <a href="${data.boletoUrl}">Link do boleto</a></p>` : ''}
    <p><strong>Timestamp:</strong> ${data.timestamp}</p>
  `;

    try {
        await sgMail.send({
            to: process.env.RECEIVER_EMAIL,
            from: process.env.SENDER_EMAIL,
            replyTo: data.email,
            subject: `Novo pedido - ${data.paymentMethod}`,
            html: htmlBody,
        });

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err: any) {
        console.error('SendGrid error:', err.response?.body ?? err);
        return NextResponse.json({ error: 'Falha ao enviar e‑mail' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
    const data = await request.json();
    console.log('[send-email] received:', data);

    // Monta a lista de itens em HTML
    const itemsHtml =
        Array.isArray(data.items) && data.items.length > 0
            ? `<h2>Itens no pedido:</h2>
       <ul>
         ${data.items
             .map((it: { id: string; title: string }) => `<li><strong>${it.title}</strong> (ID: ${it.id})</li>`)
             .join('')}
       </ul>`
            : '';

    const addressHtml = data.cep
        ? `
      <h2>Endereço de entrega</h2>
      <p>
        <strong>CEP:</strong> ${data.cep}<br/>
        <strong>Bairro:</strong> ${data.bairro}<br/>
        <strong>Rua:</strong> ${data.rua}<br/>
        <strong>Nº:</strong> ${data.numero}
      </p>
    `
        : '';

    // Mescle no corpo principal:
    const htmlBody = `
    <h1>Novo Pedido (${data.paymentMethod.toUpperCase()})</h1>
    <p><strong>Nome:</strong> ${data.first_name} ${data.last_name}</p>
    <p><strong>Email:</strong> ${data.email}</p>

    ${addressHtml}

    ${
        Array.isArray(data.items) && data.items.length
            ? `<h2>Itens no pedido:</h2>
         <ul>
           ${data.items.map((it: any) => `<li>${it.title} (ID: ${it.id})</li>`).join('')}
         </ul>`
            : ''
    }

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

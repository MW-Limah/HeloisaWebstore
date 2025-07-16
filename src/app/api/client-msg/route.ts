// app/api/client-msg/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const { nome, sobrenome, email, mensagem } = await req.json();

        const msg = {
            to: 'loja.heloisaofc@gmail.com', // Seu email de recebimento
            from: 'mwlima.dev@gmail.com', // Precisa ser verificado no SendGrid
            subject: `Nova mensagem de um cliente - ${nome} ${sobrenome}`,
            text: `Email: ${email}\nMensagem:\n${mensagem}`,
            html: `
                <h3>Um cliente enviou uma mensagem pelo site da loja</h3>
                <p><strong>Nome:</strong> ${nome} ${sobrenome}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${mensagem}</p>
            `,
        };

        await sgMail.send(msg);

        return NextResponse.json({ message: 'Email enviado com sucesso!' }, { status: 200 });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return NextResponse.json({ error: 'Erro ao enviar e-mail.' }, { status: 500 });
    }
}

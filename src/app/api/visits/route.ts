// /app/api/visits/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const ipHeader = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const ip = ipHeader.split(',')[0].trim();

        const cookies = req.headers.get('cookie') || '';
        const hasVisited = cookies.includes('visited_home=true');

        // Log para debug
        console.log('📡 IP detectado:', ip, '| Cookies:', cookies);

        const BLOCKED_IPS = ['127.0.0.1', '::1', '86.142.1.251', '187.86.172.164'];

        const client = await clientPromise;
        const db = client.db('heloisa_webstore');
        const collection = db.collection('visitas');

        // Sempre busca o valor atual do banco
        const currentDoc = await collection.findOne({ page: 'home' });
        let count = currentDoc?.count ?? 0;

        // Se IP está bloqueado ou já visitou, apenas retorna sem contar
        if (BLOCKED_IPS.includes(ip) || hasVisited) {
            const motivo = BLOCKED_IPS.includes(ip)
                ? `IP ${ip} ignorado (bloqueado)`
                : `IP ${ip} ignorado (cookie já visitou)`;

            return new NextResponse(JSON.stringify({ count, debug: motivo }), {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, max-age=0, must-revalidate',
                },
            });
        }

        // Incrementa contador
        await collection.updateOne({ page: 'home' }, { $inc: { count: 1 } }, { upsert: true });
        const updatedDoc = await collection.findOne({ page: 'home' });
        count = updatedDoc?.count ?? count + 1;

        // Envia e-mail
        try {
            await sgMail.send({
                to: 'mwlima.dev@gmail.com',
                from: 'Alerta <loja.heloisaofc@gmail.com>',
                subject: '🧭 Novo visitante no site!',
                text: `Novo visitante detectado no site. IP: ${ip} | Visita nº ${count}`,
                html: `<p>🎉 Novo visitante no site!</p><p><strong>IP:</strong> ${ip}</p><p><strong>Contador:</strong> ${count}</p>`,
            });
            console.log(`📧 E-mail enviado para visita nº ${count}`);
        } catch (emailErr) {
            console.error('❌ Falha ao enviar e-mail:', emailErr);
        }

        return new NextResponse(JSON.stringify({ count, debug: `IP ${ip} contado e e-mail enviado` }), {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
                'Set-Cookie': `visited_home=true; Path=/; Max-Age=${60 * 60}; SameSite=Lax`,
            },
        });
    } catch (err) {
        console.error('Erro no contador de visitas:', err);
        return new NextResponse(JSON.stringify({ error: 'Erro interno do servidor' }), {
            status: 500,
            headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' },
        });
    }
}

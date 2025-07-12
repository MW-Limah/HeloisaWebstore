// /app/api/visits/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!); // Defina isso em .env.local

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const ip =
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';

        const BLOCKED_IPS = ['127.0.0.1', '::1', '86.142.1.251', '187.86.172.164'];
        const client = await clientPromise;
        const db = client.db('heloisa_webstore');
        const collection = db.collection('visitas');

        let count = 1;

        // Lê cookies
        const cookies = req.headers.get('cookie') || '';
        const hasVisited = cookies.includes('visited_home=true');

        if (BLOCKED_IPS.includes(ip) || hasVisited) {
            const doc = await collection.findOne({ page: 'home' });
            count = doc?.count ?? 1;

            return new NextResponse(
                JSON.stringify({
                    count,
                    debug: hasVisited ? `IP ${ip} ignorado (cookie já visitou)` : `IP ${ip} ignorado (bloqueado)`,
                }),
                {
                    status: 200,
                    headers: {
                        'Cache-Control': 'no-store, max-age=0, must-revalidate',
                    },
                }
            );
        }

        // Incrementa contador
        await collection.updateOne({ page: 'home' }, { $inc: { count: 1 } }, { upsert: true });
        const doc = await collection.findOne({ page: 'home' });
        count = doc?.count ?? 1;

        // 🚀 Envia e-mail de notificação
        await sgMail.send({
            to: 'mwlima.dev@gmail.com', // altere para seu e-mail real
            from: 'Alerta <loja.heloisaofc@gmail.com>', // remetente verificado no SendGrid
            subject: '🧭 Novo visitante no site!',
            text: `Novo visitante detectado no site. IP: ${ip} | Visita nº ${count}`,
            html: `<p>🎉 Novo visitante no site!</p><p><strong>IP:</strong> ${ip}</p><p><strong>Contador:</strong> ${count}</p>`,
        });

        const response = new NextResponse(
            JSON.stringify({
                count,
                debug: `IP ${ip} contado e e-mail enviado`,
            }),
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, max-age=0, must-revalidate',
                    'Set-Cookie': `visited_home=true; Path=/; Max-Age=${60 * 60}; SameSite=Lax`,
                },
            }
        );

        console.log(`🔄 IP contado: ${ip}, visita nº ${count}, e-mail enviado.`);

        return response;
    } catch (err) {
        console.error('Erro no contador de visitas:', err);
        return new NextResponse(JSON.stringify({ error: 'Erro interno do servidor' }), {
            status: 500,
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
            },
        });
    }
}

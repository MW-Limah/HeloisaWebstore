// força rota sempre dinâmica
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function GET(req: Request) {
    try {
        const ip =
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';

        const BLOCKED_IPS = ['127.0.0.1', '::1', '86.142.1.251', '187.86.172.164'];

        const client = await clientPromise;
        const db = client.db('heloisa_webstore');
        const collection = db.collection('visitas');

        let count = 1;

        if (BLOCKED_IPS.includes(ip)) {
            // Apenas busca o contador atual, sem incrementar
            const doc = await collection.findOne({ page: 'home' });
            count = doc?.count ?? 1;

            return NextResponse.json(
                {
                    count,
                    debug: `IP ${ip} ignorado (sem incremento)`,
                },
                {
                    status: 200,
                    headers: {
                        'Cache-Control': 'no-store, max-age=0, must-revalidate',
                    },
                }
            );
        }

        // Se IP não for bloqueado: incrementa + busca atualizado
        await collection.updateOne({ page: 'home' }, { $inc: { count: 1 } }, { upsert: true });

        const doc = await collection.findOne({ page: 'home' });
        count = doc?.count ?? 1;

        console.log(`🔄 IP contado: ${ip}, novo valor: ${count}`);

        return NextResponse.json(
            {
                count,
                debug: `IP ${ip} contado normalmente`,
            },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, max-age=0, must-revalidate',
                },
            }
        );
    } catch (err) {
        console.error('Erro no contador de visitas:', err);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, max-age=0, must-revalidate',
                },
            }
        );
    }
}

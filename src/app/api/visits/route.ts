// força rota sempre dinâmica
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function GET(req: Request) {
    try {
        // Area do IP
        const ip =
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';

        const BLOCKED_IPS = ['127.0.0.1', '::1', '86.142.1.251'];

        if (BLOCKED_IPS.includes(ip)) {
            console.log(`🛑 IP bloqueado: ${ip}`);
            return NextResponse.json({
                count: 'ignorado',
                debug: `IP ${ip} ignorado`,
            });
        }
        const client = await clientPromise;
        const db = client.db('heloisa_webstore');
        const collection = db.collection('visitas');

        // 1️⃣ Incrementa o contador (cria se não existir)
        await collection.updateOne({ page: 'home' }, { $inc: { count: 1 } }, { upsert: true });

        // 2️⃣ Busca o documento atualizado
        const doc = await collection.findOne({ page: 'home' });
        const count = doc ? doc.count : 1;

        console.log('🔄 contador final (via findOne):', count);

        return NextResponse.json(
            { count },
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

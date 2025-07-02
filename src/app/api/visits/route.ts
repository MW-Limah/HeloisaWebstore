import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('heloisa_webstore');
        const collection = db.collection('visitas');

        const result = await collection.findOneAndUpdate(
            { page: 'home' },
            { $inc: { count: 1 } },
            {
                upsert: true,
                returnDocument: 'after' as const, // <- correção para TypeScript
            }
        );

        return NextResponse.json({ count: result.value?.count ?? 1 });
    } catch (error) {
        console.error('Erro no contador de visitas:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}

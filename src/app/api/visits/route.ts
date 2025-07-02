import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('meu_banco');
        const collection = db.collection('visitas');

        const result = await collection.findOneAndUpdate(
            { page: 'home' }, // ou qualquer identificador de página
            { $inc: { count: 1 } },
            { upsert: true, returnDocument: 'after' }
        );

        return NextResponse.json({ count: result.value?.count ?? 1 });
    } catch (err) {
        console.error('Erro ao contar visitas:', err);
        return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
    }
}

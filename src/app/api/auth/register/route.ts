import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password, nome, role } = body;

    console.log('[register] Dados recebidos:', { email, password, nome, role });

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nome, role },
    });

    if (error) {
        console.error('[register] Erro ao criar usuário:', error.message);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('[register] Usuário criado:', data.user?.id);

    const { error: insertError } = await supabase.from('profiles').insert({
        id: data.user?.id,
        email,
        nome,
        role,
    });

    if (insertError) {
        console.error('[register] Erro ao inserir no banco:', insertError.message);
        return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user }, { status: 201 });
}

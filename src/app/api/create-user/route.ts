// src/app/api/create-user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdminClient';

export async function POST(req: NextRequest) {
    const { email, password, nome, role } = await req.json();

    // 1. Cria o usuário
    const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 2. Cria o perfil
    const { error: profileError } = await supabaseAdmin.from('profiles').insert([{ id: user.user.id, nome, role }]);

    if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Usuário criado com sucesso!' }, { status: 201 });
}

// src/app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

console.log('[register] SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('[register] SERVICE_ROLE_KEY set?:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// opcional: validação de conexão
const { data: test, error: testErr } = await supabaseAdmin.from('profiles').select('id').limit(1);
console.log('[register] teste select profiles →', { test, testErr });

export async function POST(request: NextRequest) {
    try {
        const { email, password, nome, role } = await request.json();
        console.log('[register] payload:', { email, password, nome, role });

        if (!email || !password || !nome || !role) {
            return NextResponse.json({ error: 'email, password, nome e role são obrigatórios.' }, { status: 400 });
        }

        // 1) cria usuário no Auth
        const { data: authData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { nome, role },
        });

        if (createErr) {
            console.error('[register] createUser error:', createErr);
            return NextResponse.json({ error: createErr.message, code: createErr.code }, { status: 400 });
        }

        const user = authData.user;
        // 2) cria/atualiza registro na tabela profiles
        const { error: profileErr } = await supabaseAdmin.from('profiles').upsert(
            {
                id: user.id,
                email,
                nome,
                role,
            },
            { onConflict: 'id' }
        );

        if (profileErr) {
            console.error('[register] upsert profile error:', profileErr);
            return NextResponse.json({ error: profileErr.message, code: profileErr.code }, { status: 400 });
        }

        // 3) monta objeto público com ROLE
        const publicUser = {
            id: user.id,
            email: user.email,
            nome: nome, // ou user.user_metadata.nome
            role: role, // ou user.user_metadata.role
        };

        return NextResponse.json({ user: publicUser }, { status: 201 });
    } catch (err: any) {
        console.error('[register] unexpected error:', err);
        return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 });
    }
}

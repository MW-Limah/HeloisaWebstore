// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

console.log('[register] SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('[register] SERVICE_ROLE_KEY set?:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!, // ↗️ garanta que esta var existe
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ↗️ e esta também
);

// faz um select de teste na tabela `profiles`
const { data: test, error: testErr } = await supabaseAdmin.from('profiles').select('id').limit(1);
console.log('[register] teste select profiles →', { test, testErr });

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('[register] payload:', body);

        const { email, password, nome } = body;
        if (!email || !password || !nome) {
            return NextResponse.json({ error: 'email, password e nome são obrigatórios.' }, { status: 400 });
        }

        // 1) cria usuário no Auth
        const { data: userData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { nome, role: 'admin', adm: nome },
        });

        if (createErr) {
            console.error('[register] createUser error:', createErr);
            return NextResponse.json({ error: createErr.message, code: createErr.code }, { status: 400 });
        }

        // 2) cria registro em profiles
        const { error: profileErr } = await supabaseAdmin
            .from('profiles')
            .insert({ id: userData.user.id, role: 'admin', nome, adm: nome });

        if (profileErr) {
            console.error('[register] insert profile error:', profileErr);
            return NextResponse.json({ error: profileErr.message, code: profileErr.code }, { status: 400 });
        }

        return NextResponse.json({ user: userData.user }, { status: 201 });
    } catch (err: any) {
        console.error('[register] unexpected error:', err);
        return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

console.log('[register] SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('[register] SERVICE_ROLE_KEY set?:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// teste opcional
const { data: test, error: testErr } = await supabaseAdmin.from('profiles').select('id').limit(1);
console.log('[register] teste select profiles →', { test, testErr });

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('[register] payload:', body);

        const { email, password, nome, role } = body;

        if (!email || !password || !nome || !role) {
            return NextResponse.json({ error: 'email, password, nome e role são obrigatórios.' }, { status: 400 });
        }

        // 1) cria usuário no Auth
        const { data: userData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { nome, role },
        });

        if (createErr) {
            console.error('[register] createUser error:', createErr);
            return NextResponse.json({ error: createErr.message, code: createErr.code }, { status: 400 });
        }

        // 2) cria registro na tabela profiles
        const { error: profileErr } = await supabaseAdmin.from('profiles').insert({
            id: userData.user.id,
            nome,
            role,
            email, // ✅ Correção aqui
        });

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

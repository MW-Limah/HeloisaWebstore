import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password, nome, role } = body;

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nome, role },
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { error: insertError } = await supabase.from('users').insert({
        id: data.user?.id,
        email,
        nome,
        role,
    });

    if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user }, { status: 201 });
}

// app/api/delete-user/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function DELETE(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'ID do usuário é obrigatório' }, { status: 400 });
        }

        // 1) Deleta o perfil primeiro (quebra o FK)
        const { error: deleteProfileErr } = await supabaseAdmin.from('profiles').delete().eq('id', userId);

        if (deleteProfileErr) {
            console.error('[delete-user] erro ao deletar perfil:', deleteProfileErr);
        } else {
            console.log('[delete-user] perfil deletado:', userId);
        }

        // 2) Agora deletar do Auth
        console.log('[delete-user] deletando auth userId=', userId);
        const { error: deleteAuthErr } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteAuthErr) {
            console.error('[delete-user] erro ao deletar usuário no Auth:', deleteAuthErr);
            return NextResponse.json({ error: deleteAuthErr.message }, { status: 500 });
        }

        console.log('[delete-user] usuário auth deletado:', userId);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[delete-user] erro inesperado:', err);
        return NextResponse.json({ error: 'Erro inesperado ao deletar usuário' }, { status: 500 });
    }
}

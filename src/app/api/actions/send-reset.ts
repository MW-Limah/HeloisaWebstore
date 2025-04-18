// app/actions/send-reset.ts
'use server';

import { supabase } from '@/app/lib/supabase';

export async function sendPasswordReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/auth/reset-password',
    });

    if (error) {
        console.error('Erro ao enviar e-mail de recuperação:', error.message);
        console.error('Detalhes do erro:', error);
        throw new Error(error.message); // Mensagem de erro detalhada
    }

    return 'Link de recuperação enviado com sucesso!';
}

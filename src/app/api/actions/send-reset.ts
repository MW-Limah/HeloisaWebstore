// app/actions/send-reset.ts
'use server';

import { supabase } from '@/app/lib/supabase'; // <-- usar o cliente público

export async function sendPasswordReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
        console.error('Erro ao enviar e-mail de recuperação:', error);
        throw new Error(error.message);
    }

    return 'Link de recuperação enviado com sucesso!';
}

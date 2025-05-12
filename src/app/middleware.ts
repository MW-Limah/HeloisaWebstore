import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from './lib/supabase';

export async function middleware(req: NextRequest) {
    const token = req.cookies['sb-access-token'];
    const {
        data: { user },
    } = await supabase.auth.getUser(token);

    const protectedPaths = ['/perfil', '/comentarios'];
    if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path)) && !user) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}

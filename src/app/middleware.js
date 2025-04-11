import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
    const token = await getToken({ req: request });

    const isAdminPage = request.nextUrl.pathname.startsWith('/pages/Admin');

    if (isAdminPage && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/pages/Admin/:path*'], // Protege tudo dentro de /pages/Admin
};

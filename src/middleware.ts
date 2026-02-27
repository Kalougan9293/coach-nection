import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASIC_AUTH_USER = process.env.ADMIN_BASIC_USER ?? 'seroussi';
const BASIC_AUTH_PASSWORD = process.env.ADMIN_BASIC_PASSWORD ?? 'Israel9293!';

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Basic ')) {
    return new NextResponse('Authentification requise', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Coach-Nection", charset="UTF-8"',
      },
    });
  }

  const base64Credentials = authHeader.slice(6);
  let decoded: string;
  try {
    decoded = atob(base64Credentials);
  } catch {
    return new NextResponse('Authentification invalide', { status: 401 });
  }
  const colonIndex = decoded.indexOf(':');
  const username = colonIndex === -1 ? decoded : decoded.slice(0, colonIndex);
  const password = colonIndex === -1 ? '' : decoded.slice(colonIndex + 1);

  if (username === BASIC_AUTH_USER && password === BASIC_AUTH_PASSWORD) {
    return NextResponse.next();
  }

  return new NextResponse('Identifiant ou mot de passe incorrect', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Coach-Nection", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: '/admin/:path*',
};

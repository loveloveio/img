import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/libs/better-auth";
import { UAParser } from 'ua-parser-js';

type Session = typeof auth.$Infer.Session;

async function adminMiddleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.LOCAL_AUTH_URL,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  if (!session) {
    if (request.nextUrl.pathname.startsWith('/admin/sign-in')) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/admin/sign-in", process.env.APP_URL));
  }

  const user = session.user;
  if (user?.role === 'admin' && request.nextUrl.pathname.startsWith('/admin/sign-in')) {
    return NextResponse.redirect(new URL("/admin/dashboard", process.env.APP_URL));
  }
  if (user?.role !== 'admin') {
    return new NextResponse('Not Found', { status: 404 });
  }
  return NextResponse.next();
}

async function memberMiddleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.LOCAL_AUTH_URL,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  if (!session && request.nextUrl.pathname.startsWith('/profile')) {
    const ua = UAParser(request.headers.get('user-agent') || '');
    if (ua.device.is('mobile')) {
      return NextResponse.redirect(new URL("/mobile/sign-in", process.env.APP_URL));
    }
    return NextResponse.redirect(new URL("/pc/sign-in", process.env.APP_URL));
  }

  if (session) {
    if (request.nextUrl.pathname.startsWith('/pc/sign-in')) {
      return NextResponse.redirect(new URL("/pc", process.env.APP_URL));
    }
    if (request.nextUrl.pathname.startsWith('/mobile/sign-in')) {
      return NextResponse.redirect(new URL("/mobile", process.env.APP_URL));
    }
  }

  return NextResponse.next();
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin')) {
    return adminMiddleware(request);
  }
  
  if (request.nextUrl.pathname.startsWith('/member') || request.nextUrl.pathname.startsWith('/api/member')) {
    return memberMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/member/:path*', 
    '/api/:path*'
  ]
};

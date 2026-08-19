import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (path.startsWith('/kitchen') && token?.role !== 'admin' && token?.role !== 'kitchen') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (path.startsWith('/delivery') && token?.role !== 'admin' && token?.role !== 'supplier') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (path.startsWith('/cashier') && token?.role !== 'admin' && token?.role !== 'cashier') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: ['/admin/:path*', '/kitchen/:path*', '/delivery/:path*', '/cashier/:path*']
};

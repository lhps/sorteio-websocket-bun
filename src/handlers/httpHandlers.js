import serveStatic from 'serve-static-bun';

export function fetchHandler(req, server) {
  const success = server.upgrade(req);
  if (success) {
    return undefined;
  }

  const url = new URL(req.url);
  if (url.pathname.startsWith('/public')) {
    return serveStatic('public', { stripFromPathname: '/public' })(req);
  }

  if (url.pathname === '/') {
    return new Response(Bun.file('public/index.html'));
  }

  if (url.pathname === '/admin') {
    return new Response(Bun.file('public/admin.html'));
  }
}

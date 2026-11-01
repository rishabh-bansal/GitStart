#!/usr/bin/env node
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { site } = require('./src/content.js');
const root = path.join(__dirname, 'public');
const base = new URL(site.url).pathname.replace(/\/$/, '');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };

function createServer() {
  return http.createServer((request, response) => {
    const send = (status, body, type = 'text/plain; charset=utf-8') => {
      response.writeHead(status, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff' });
      response.end(request.method === 'HEAD' ? undefined : body);
    };
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.setHeader('Allow', 'GET, HEAD');
      return send(405, 'Method not allowed');
    }
    let pathname;
    try { pathname = decodeURIComponent(request.url.split('?')[0]); }
    catch { return send(400, 'Malformed URL'); }
    if (pathname.includes('\0') || pathname.includes('\\') || pathname.split('/').some(part => part === '..' || part.startsWith('.'))) {
      return send(403, 'Forbidden');
    }
    if (base && (pathname === '/' || pathname === base)) {
      response.writeHead(302, { Location: `${base}/` });
      return response.end();
    }
    if (base && !pathname.startsWith(`${base}/`)) return send(404, 'Not found');
    const relative = base ? pathname.slice(base.length) : pathname;
    let target = path.resolve(root, `.${relative}`);
    if (!target.startsWith(`${root}${path.sep}`) && target !== root) return send(403, 'Forbidden');
    try {
      const real = fs.realpathSync(target);
      if (!real.startsWith(`${root}${path.sep}`) && real !== root) return send(403, 'Forbidden');
      if (fs.statSync(target).isDirectory()) {
        if (!pathname.endsWith('/')) {
          response.writeHead(301, { Location: `${pathname}/` });
          return response.end();
        }
        target = path.join(target, 'index.html');
      }
      return send(200, fs.readFileSync(target), types[path.extname(target)] || 'application/octet-stream');
    } catch {
      let body = 'Not found';
      try { body = fs.readFileSync(path.join(root, '404.html')); } catch { /* Build may not exist yet. */ }
      return send(404, body, 'text/html; charset=utf-8');
    }
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 8080);
  createServer().listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}${base}/`));
}
module.exports = { createServer };

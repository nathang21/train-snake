#!/usr/bin/env node
// Zero-dependency static server for Train Snake (serves the PWA: html, manifest, sw, icons).
// Usage: node server.js [port]   (default 8099)
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Discover this machine's LAN IPv4 addresses (so we don't hardcode anything).
function lanAddresses() {
  const out = [];
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const ni of ifaces[name] || []) {
      if (ni.family === 'IPv4' && !ni.internal) out.push(ni.address);
    }
  }
  return out;
}

const PORT = process.argv[2] || process.env.PORT || 8099;
const ROOT = __dirname;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/' || rel === '') rel = '/index.html';
  // resolve safely inside ROOT (no path traversal)
  const filePath = path.join(ROOT, path.normalize(rel));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }

  fs.readFile(filePath, (err, buf) => {
    if (err) {
      // SPA-ish fallback: unknown routes serve the game
      return fs.readFile(path.join(ROOT, 'index.html'), (e2, html) => {
        if (e2) { res.writeHead(404); return res.end('not found'); }
        res.writeHead(200, { 'Content-Type': TYPES['.html'] });
        res.end(html);
      });
    }
    const type = TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    // service worker must not be cached long, so updates land; icons/html revalidate cheaply
    const cache = filePath.endsWith('sw.js') ? 'no-cache' : 'no-cache';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': cache });
    res.end(buf);
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log(`🚂 Train Snake running at http://localhost:${PORT}`);
  for (const ip of lanAddresses()) console.log(`   LAN:     http://${ip}:${PORT}`);
  console.log(`   Remote:  put it behind an HTTPS tunnel for phones, e.g.  tailscale serve --bg ${PORT}`);
});

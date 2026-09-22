/**
 * @file serve-dist.mjs
 * @description Serves dist/ the way Vercel static hosting does, so the
 * prerendered output can be checked locally before deploying.
 *
 * `vite preview` is not a substitute: it rewrites every HTML request to
 * /index.html, so every route renders the home page and the prerendering is
 * invisible. This resolves /research to dist/research/index.html, returns a real
 * 404.html with a 404 status for unknown paths, and drops trailing slashes to
 * match "trailingSlash": false in vercel.json.
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'dist');
const PORT = Number(process.argv[2] || 5000);

const TYPES = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json',
    '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.png': 'image/png', '.webp': 'image/webp', '.mp4': 'video/mp4',
    '.pdf': 'application/pdf', '.xml': 'text/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const isFile = async (p) => { try { return (await stat(p)).isFile(); } catch { return false; } };

createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let pathname = decodeURIComponent(url.pathname);

    // Match vercel.json "trailingSlash": false
    if (pathname.length > 1 && pathname.endsWith('/')) {
        res.writeHead(308, { Location: pathname.replace(/\/+$/, '') + url.search });
        return res.end();
    }

    // Keep requests inside dist/
    const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
    const candidates = pathname === '/'
        ? [join(DIST, 'index.html')]
        : [join(DIST, safe), join(DIST, safe, 'index.html'), join(DIST, `${safe}.html`)];

    for (const file of candidates) {
        if (await isFile(file)) {
            const body = await readFile(file);
            res.writeHead(200, {
                'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream',
                'Content-Length': body.length,
            });
            return res.end(body);
        }
    }

    const notFound = join(DIST, '404.html');
    if (await isFile(notFound)) {
        const body = await readFile(notFound);
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': body.length });
        return res.end(body);
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404');
}).listen(PORT, () => {
    console.log(`Serving dist/ like Vercel would:  http://localhost:${PORT}/`);
});

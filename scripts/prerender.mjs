/**
 * @file prerender.mjs
 * @description Post-build step. Vite emits one dist/index.html with an empty
 * <main>, invisible to link previews, search engines and screening tools. This
 * writes a real HTML file per route, with that route's markup already in place
 * and its own title, description and canonical URL. The browser adopts the
 * markup instead of rebuilding it.
 */

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { allRoutes, notFoundRoute } from '../src/routes.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SITE = 'https://vin-ayapilla-portfolio.vercel.app';

const escapeAttr = (v) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// The empty mount point Vite emits; any extra attributes (e.g. tabindex) are kept.
const EMPTY_ROOT = /<main id="app-root"([^>]*)><\/main>/;
const fileFor = (path) => (path === '/' ? join(DIST, 'index.html') : join(DIST, path.slice(1), 'index.html'));

function page(shell, route) {
    const url = route.path === '/' ? `${SITE}/` : `${SITE}${route.path}`;
    const t = escapeAttr(route.title);
    const d = escapeAttr(route.description || '');
    return shell
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
        .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
        .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
        .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
        .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
        .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
        .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
        .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`)
        .replace(/<body[^>]*>/, `<body data-page="${route.page}">`)
        .replace(EMPTY_ROOT, (_m, attrs) =>
            `<main id="app-root"${attrs} data-prerendered="${route.path}">${route.render()}</main>`);
}

const shell = await readFile(join(DIST, 'index.html'), 'utf8');
if (!EMPTY_ROOT.test(shell)) {
    throw new Error('prerender: #app-root is not the empty shell this step expects');
}

for (const route of allRoutes) {
    const out = fileFor(route.path);
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, page(shell, route), 'utf8');
}
await writeFile(join(DIST, '404.html'), page(shell, notFoundRoute), 'utf8');

await writeFile(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map((r) => `  <url><loc>${r.path === '/' ? `${SITE}/` : SITE + r.path}</loc></url>`).join('\n')}
</urlset>
`, 'utf8');
await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`, 'utf8');

// Guard rail: every internal href and src must resolve to an emitted route or a
// file in dist. A renamed image or stale link fails the build, not a visitor.
const known = new Set(allRoutes.map((r) => r.path));
const broken = [];
for (const route of [...allRoutes, notFoundRoute]) {
    const html = await readFile(route === notFoundRoute ? join(DIST, '404.html') : fileFor(route.path), 'utf8');
    const refs = new Set([
        ...[...html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)].map((m) => m[1]),
        // Asset paths named inside data attributes, e.g. the portrait sources.
        ...[...html.matchAll(/["'(](\/(?:images|assets)\/[^"')\s]+)/g)].map((m) => m[1]),
    ]);
    for (const ref of refs) {
        if (known.has(ref) || ref === '/') continue;
        try { await access(join(DIST, decodeURIComponent(ref.slice(1)))); }
        catch { broken.push(`${route.path} -> ${ref}`); }
    }
}
if (broken.length) {
    throw new Error(`prerender: ${broken.length} broken internal reference(s):\n  ${broken.join('\n  ')}`);
}

console.log(`prerendered ${allRoutes.length} routes, plus 404.html, sitemap.xml and robots.txt`);
console.log(`verified ${known.size} routes; every internal link and asset reference resolves`);

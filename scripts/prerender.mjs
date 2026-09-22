/**
 * @file prerender.mjs
 * @description Post-build step. Vite emits a single dist/index.html whose
 * <main> is empty, which is invisible to link-preview bots, search crawlers and
 * any tool that reads HTML without running JavaScript. This walks the shared
 * route table and writes a real HTML file per route, with that route's markup
 * already inside #app-root and its own title, description and canonical URL.
 *
 * The client router adopts this markup on first paint rather than rebuilding it.
 */

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { staticRoutes, detailRoutes, notFoundRoute } from '../src/routes.js';
import { workData, projectData } from '../src/data.js';
import {
    createModernWorkItemHTML,
    createProjectCardHTML,
    createFilterPillsHTML,
    createDetailHTML,
    bodyClassesFor,
    notFoundHTML,
} from '../src/page-fragments.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SITE = 'https://vin-ayapilla-portfolio.vercel.app';

const escapeAttr = (value) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Pulls a <template id="..."> body out of the built shell. */
function templateBody(shell, id) {
    const open = shell.indexOf(`<template id="${id}">`);
    if (open === -1) throw new Error(`prerender: template "${id}" not found`);
    const start = open + `<template id="${id}">`.length;
    const end = shell.indexOf('</template>', start);
    if (end === -1) throw new Error(`prerender: template "${id}" is unterminated`);
    return shell.slice(start, end);
}

/** Replaces the inner HTML of an empty container, matched by id or class. */
function fillContainer(html, attr, value, inner) {
    const pattern = new RegExp(
        `(<(\\w+)[^>]*${attr}="${value}"[^>]*>)([\\s\\S]*?)(</\\2>)`
    );
    if (!pattern.test(html)) {
        throw new Error(`prerender: no container with ${attr}="${value}" to fill`);
    }
    return html.replace(pattern, (_m, open, _tag, _old, close) => open + inner + close);
}

/** Fills the list regions the client router would otherwise populate. */
function hydrateLists(html, templateId) {
    if (templateId === 'page-workex') {
        return fillContainer(html, 'id', 'workex-list', workData.map(createModernWorkItemHTML).join(''));
    }
    if (templateId === 'page-projects') {
        const categories = [...new Set(projectData.map((p) => p.category))];
        return fillContainer(
            fillContainer(html, 'class', 'project-filters[^"]*', createFilterPillsHTML(categories)),
            'id', 'projects-grid', projectData.map(createProjectCardHTML).join('')
        );
    }
    return html;
}

function applyMeta(shell, { path, title, description }) {
    const url = path === '/' ? `${SITE}/` : `${SITE}${path}`;
    const t = escapeAttr(title);
    const d = escapeAttr(description || '');
    return shell
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
        .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
        .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
        .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
        .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
        .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
        .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
        .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`);
}

function buildPage(shell, route, innerHTML) {
    let html = applyMeta(shell, route);
    html = html.replace(
        /<body class="[^"]*">/,
        `<body class="${bodyClassesFor(route.path)}">`
    );
    html = html.replace(
        '<main id="app-root"></main>',
        `<main id="app-root" data-prerendered="${route.path}">${innerHTML}</main>`
    );
    return html;
}

async function emit(path, html) {
    const out = path === '/' ? join(DIST, 'index.html') : join(DIST, path.slice(1), 'index.html');
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, html, 'utf8');
    return out;
}

const shell = await readFile(join(DIST, 'index.html'), 'utf8');
if (!shell.includes('<main id="app-root"></main>')) {
    throw new Error('prerender: #app-root is not the empty shell this step expects');
}

let count = 0;
for (const route of staticRoutes) {
    const body = hydrateLists(templateBody(shell, route.templateId), route.templateId);
    await emit(route.path, buildPage(shell, route, body));
    count += 1;
}
for (const route of detailRoutes) {
    await emit(route.path, buildPage(shell, route, createDetailHTML(route)));
    count += 1;
}

// A real 404 rather than a silent fallback to the home page. Uses the same
// markup the client router renders, so the two can never drift.
await writeFile(join(DIST, '404.html'), buildPage(shell, notFoundRoute, notFoundHTML), 'utf8');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticRoutes, ...detailRoutes]
    .map((r) => `  <url><loc>${r.path === '/' ? SITE + '/' : SITE + r.path}</loc></url>`)
    .join('\n')}
</urlset>
`;
await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(
    join(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
    'utf8'
);

// Guard rail: every internal href and src must resolve to a route we just
// emitted or to a file that exists in dist. Catches a renamed image or a stale
// link at build time instead of as a 404 in front of a visitor.
const knownRoutes = new Set([...staticRoutes, ...detailRoutes].map((r) => r.path));
const broken = [];
for (const route of [...staticRoutes, ...detailRoutes]) {
    const file = route.path === '/' ? join(DIST, 'index.html') : join(DIST, route.path.slice(1), 'index.html');
    const html = await readFile(file, 'utf8');
    const refs = new Set([...html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)].map((m) => m[1]));
    for (const href of refs) {
        if (knownRoutes.has(href)) continue;
        try {
            await access(join(DIST, href.slice(1)));
        } catch {
            broken.push(`${route.path} -> ${href}`);
        }
    }
}
if (broken.length) {
    throw new Error(`prerender: ${broken.length} broken internal link(s):\n  ${broken.join('\n  ')}`);
}

console.log(`prerendered ${count} routes, plus 404.html, sitemap.xml and robots.txt`);
console.log(`verified ${knownRoutes.size} routes; every internal link and asset reference resolves`);

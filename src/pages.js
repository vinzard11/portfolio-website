/**
 * @file pages.js
 * @description One render function per page, each returning the markup for
 * #app-root. Shared by the browser router and the build-time prerenderer, so the
 * HTML a crawler sees is the HTML a visitor gets.
 */

import { site, thesis, now, experience, research, researchGroups, projects, profile } from './content.js';
import { figureHTML, previewHTML } from './charts.js';
import { chrome, footer, menu, rich, esc, pills } from './ui.js';

/* ------------------------------------------------------------------ home */

const CORNERS = [
    { href: '/research', n: '01', file: 'papers & evaluations', label: 'Research' },
    { href: '/experience', n: '02', file: 'four roles', label: 'Experience' },
    { href: '/profile', n: '03', file: 'about & effective altruism', label: 'Profile' },
    { href: '/projects', n: '04', file: 'mba & earlier', label: 'Projects' },
];

// Two portraits share one halftone grid; the home page morphs between them.
const PORTRAITS = [
    { ink: '/images/portrait-now-ink.png', photo: '/images/portrait-now-photo.webp' },
    { ink: '/images/portrait-studio-ink.png', photo: '/images/portrait-studio-photo.webp' },
];

const nowList = (items) => `
    <ul class="now-list">
        ${items.map((n) => `
            <li>
                <p class="now-status">${n.status}</p>
                <h3 class="now-title">${n.href ? `<a href="${n.href}">${n.title}</a>` : n.title}</h3>
                <p class="now-text">${n.text}</p>
            </li>`).join('')}
    </ul>`;

export function home() {
    return `
        ${menu()}
        <section class="home-screen" aria-label="Introduction">
            <div class="timing" aria-hidden="true"></div>
            <header class="menubar">
                <a class="mb-logo" href="/" aria-label="Vinith Ayapilla, home">VA</a>
                <nav class="mb-menu" aria-label="Quick links">
                    <a href="#now">Now</a>
                    <a href="${site.resume}" target="_blank" rel="noopener">Résumé</a>
                    <button type="button" class="mb-menu-btn" data-menu-open aria-controls="menu" aria-expanded="false">Menu</button>
                </nav>
                <div class="mb-right">
                    <span class="mb-cell"><span class="mb-dot" aria-hidden="true"></span>${site.location}</span>
                    <span class="mb-cell mb-clock" data-clock aria-hidden="true"></span>
                </div>
            </header>
            ${CORNERS.map((c, i) => `
                <a class="corner c${i + 1}" href="${c.href}">
                    <span class="corner-n">${c.n}</span>
                    <span class="corner-file">${c.file}</span>
                    <span class="corner-label">${c.label}</span>
                </a>`).join('')}
            <figure class="portrait" data-portrait='${JSON.stringify(PORTRAITS)}'>
                <img src="/images/portrait-halftone.png" width="1200" height="1200" alt="Halftone portrait of Vinith Ayapilla, smiling, arms folded on a table" fetchpriority="high">
            </figure>
            <div class="nameplate">
                <p class="role">${site.roleLine}</p>
                <h1 class="name">Vinith Ayapilla</h1>
            </div>
            <a class="scroll-cue" href="#about">More below</a>
        </section>

        <section class="home-section" id="about">
            <h2 class="section-label">About</h2>
            <div class="home-copy">
                ${thesis.map((p, i) => `<p${i === 0 ? ' class="lede"' : ''}>${p}</p>`).join('')}
                <p class="home-links">
                    <a href="/research">Read the research</a>
                    <a href="/experience">See the work</a>
                    <a href="/profile">More about me</a>
                </p>
            </div>
        </section>

        <section class="home-section" id="now">
            <h2 class="section-label">Now</h2>
            ${nowList(now)}
        </section>
        ${footer()}`;
}

/* ------------------------------------------------------------ directories */

/**
 * The research and projects index. Rows carry a preview figure that the
 * browser floats beside the hovered row; without JS the rows are plain links.
 */
function directory({ title, intro, groups, rows, after = '' }) {
    const used = groups.filter((g) => rows.some((r) => r.group === g));
    return `
        ${chrome({ back: '/' })}
        <div class="dir">
            <aside class="dir-side">
                <h1 class="dir-title">${title}</h1>
                <p class="dir-intro">${intro}</p>
                <div class="dir-cats" role="group" aria-label="Filter ${title.toLowerCase()}">
                    <button type="button" data-filter="all" aria-pressed="true">All</button>
                    ${used.map((g) => `<button type="button" data-filter="${esc(g)}" aria-pressed="false">${g}</button>`).join('')}
                </div>
            </aside>
            <div class="dir-main">
                <ol class="dir-list" data-directory>
                    ${rows.map((r) => {
                        const inner = `
                            <span class="r-title">${r.short}</span>
                            <span class="r-meta">${r.meta}</span>
                            <span class="r-status">/${r.status.toLowerCase()}${r.href ? ' <span aria-hidden="true">→</span>' : ''}</span>`;
                        return `
                        <li data-group="${esc(r.group)}">
                            ${r.href
                                ? `<a class="row" href="${r.href}" data-preview="${r.slug}">${inner}</a>`
                                : `<div class="row is-static" data-preview="${r.slug}">${inner}</div>`}
                            <template data-preview-for="${r.slug}"><div class="pv${r.imagePreview ? ' pv-image' : ''}">${r.preview}</div></template>
                        </li>`;
                    }).join('')}
                </ol>
                <div class="dir-preview" aria-hidden="true"></div>
                ${after}
            </div>
        </div>
        ${footer({ fixed: true })}`;
}

export function researchIndex() {
    const rows = research.map((r) => ({
        slug: r.slug,
        short: r.short || r.title,
        meta: r.meta,
        status: r.status,
        group: r.group,
        href: r.body ? `/research/${r.slug}` : null,
        preview: previewHTML(r.figure),
        imagePreview: !!r.figure?.image,
    }));
    const teaser = now.find((n) => n.title === 'Multilingual LLM safety');
    return directory({
        title: 'Research',
        intro: 'Whether we can trust what a language model says, and how we would know. Plus independent safety and policy work.',
        groups: researchGroups,
        rows,
        after: `
            <section class="currently" aria-labelledby="currently-h">
                <h2 class="section-label" id="currently-h">Currently working on</h2>
                <h3 class="currently-title">${teaser.title} <span class="currently-status">(${teaser.status.toLowerCase()})</span></h3>
                <p>${teaser.text}</p>
            </section>`,
    });
}

export function projectsIndex() {
    const rows = projects.map((p) => ({
        slug: p.slug,
        short: p.title.split(': ').slice(1).join(': ') || p.title,
        meta: p.meta,
        status: p.group,
        group: p.group,
        href: `/projects/${p.slug}`,
        preview: `<img src="${p.image}" alt="" loading="lazy" decoding="async">`,
        imagePreview: true,
    }));
    return directory({
        title: 'Projects',
        intro: 'Strategy, product and technical work from my MBA and earlier. Older than the research, and kept here for the business side of my background.',
        groups: ['Strategy', 'Product', 'Technical'],
        rows,
    });
}

/* ------------------------------------------------------------- experience */

/** Groups consecutive roles at the same organization into one panel. */
function experienceGroups() {
    const groups = [];
    for (const e of experience) {
        const last = groups[groups.length - 1];
        if (e.group && last && last.key === e.group) last.roles.push(e);
        else groups.push({ key: e.group || e.slug, roles: [e] });
    }
    return groups;
}

/** "Sep 2025 - Present" across a group becomes "2025 to now". */
function yearSpan(roles) {
    const parts = roles.map((r) => r.date.split(' - '));
    const startYear = Math.min(...parts.map(([a]) => Number(a.slice(-4))));
    const ongoing = parts.some(([, b]) => /present/i.test(b));
    const endYear = Math.max(...parts.map(([, b]) => (/present/i.test(b) ? 0 : Number(b.slice(-4)))));
    return `${startYear} <span>to</span> ${ongoing ? 'now' : endYear}`;
}

const eduItem = (ed) => `
    <li>
        <span class="edu-school">${ed.school}</span>
        <span class="edu-degree">${ed.degree}<small>${ed.note}</small>${ed.extra ? `<small>${ed.extra}</small>` : ''}</span>
        <span class="edu-when">${ed.when}</span>
    </li>`;

export function experienceIndex() {
    const groups = experienceGroups();
    const total = String(groups.length).padStart(2, '0');
    return `
        ${chrome({ back: '/', label: 'Experience' })}
        <h1 class="sr-only">Experience</h1>
        <div class="panels">
            ${groups.map((g, i) => {
                const lead = g.roles[0];
                const tags = [...new Set(g.roles.flatMap((r) => r.tags))];
                return `
                ${g.roles.map((r) => `<div class="panel-anchor" id="${r.slug}"></div>`).join('')}
                <section class="panel${i % 2 ? ' is-dark' : ''}" aria-labelledby="pt-${g.key}">
                    <div class="panel-lead">
                        <p class="panel-years">${yearSpan(g.roles)}</p>
                        <h2 class="pt-company" id="pt-${g.key}">${lead.company}</h2>
                        <p class="pt-org">${lead.org} · ${lead.location.split(' · ')[0]}</p>
                    </div>
                    <ol class="panel-roles${g.roles.length > 1 ? ' is-progression' : ''}">
                        ${g.roles.map((r) => `
                        <li>
                            <p class="pr-date">${r.date.replace(' - ', ' to ')}</p>
                            <h3 class="pr-role">${r.role}</h3>
                            <p class="pr-summary">${r.summary}</p>
                            <a class="pill pill-solid" href="/experience/${r.slug}" aria-label="View role: ${esc(r.role)}">View role</a>
                        </li>`).join('')}
                    </ol>
                    <ul class="panel-tags" aria-label="Focus areas">${tags.map((t) => `<li>${t}</li>`).join('')}</ul>
                    <p class="panel-index" aria-hidden="true">${String(i + 1).padStart(2, '0')} / ${total}</p>
                </section>`;
            }).join('')}
        </div>
        <section class="after-panels">
            <h2 class="section-label">Education</h2>
            <ul class="edu-list">${profile.education.map(eduItem).join('')}</ul>
            <p class="after-links"><a href="${site.resume}" target="_blank" rel="noopener">Résumé (PDF)</a><a href="/profile">Skills and effective altruism</a></p>
        </section>
        ${footer()}`;
}

/* --------------------------------------------------------- detail pages */

function docShell({ back, eyebrow, title, meta, figure, figureClass = '', body, aside = '', next }) {
    return `
        ${chrome({ back })}
        <article class="doc">
            <header class="doc-head">
                <p class="eyebrow">${eyebrow}</p>
                <h1 class="doc-title">${title}</h1>
                <dl class="doc-meta">${meta.filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
            </header>
            ${figure ? `<figure class="doc-figure ${figureClass}">${figure}</figure>` : ''}
            <div class="doc-body">${body}</div>
            ${aside}
            ${next ? `<nav class="doc-next" aria-label="Next"><span>Next</span><a href="${next.href}">${next.title} <span aria-hidden="true">→</span></a></nav>` : ''}
        </article>
        ${footer()}`;
}

const nextOf = (list, i, base, label = (x) => x.short || x.title) => {
    const n = list[(i + 1) % list.length];
    return n && list.length > 1 ? { href: `${base}/${n.slug}`, title: label(n) } : null;
};

export function researchDetail(item) {
    const linked = research.filter((r) => r.body);
    const i = linked.indexOf(item);
    return docShell({
        back: '/research',
        eyebrow: `Research · ${item.group}`,
        title: item.title,
        meta: [['Venue', item.venue], ['Status', item.status], ['Authors', item.authors]],
        figure: figureHTML(item.figure, item.title),
        figureClass: item.figure?.image ? 'is-image' : '',
        body: `
            ${item.body.map((p) => rich(p)).join('')}
            ${item.held ? '<p class="held">The paper is held back until review completes.</p>' : ''}
            ${item.links ? `<p class="doc-links">${item.links.map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join('')}</p>` : ''}`,
        next: nextOf(linked, i, '/research'),
    });
}

export function experienceDetail(item) {
    const i = experience.indexOf(item);
    const siblings = item.group ? experience.filter((e) => e.group === item.group).slice().reverse() : [];
    const progression = siblings.length > 1
        ? siblings.map((e) => (e === item ? `<strong>${e.role}</strong>` : `<a href="/experience/${e.slug}">${e.role}</a>`)
            + ` <span class="prog-date">(${e.date.split(' - ')[0]})</span>`).join(' <span aria-hidden="true">→</span><span class="sr-only">, then</span> ')
        : '';
    return docShell({
        back: `/experience#${item.slug}`,
        eyebrow: `${item.company} · ${item.org}`,
        title: item.role,
        meta: [['Dates', item.date.replace(' - ', ' to ')], ['Location', item.location], ['Progression', progression]],
        body: `
            <section class="glance" aria-labelledby="glance-h">
                <h2 id="glance-h">At a glance</h2>
                <ul>${item.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>
            </section>
            ${item.sections.map((sec) => `<section><h2>${sec.title}</h2>${rich(sec.body)}</section>`).join('')}
            <section><h2>Tools and skills</h2>${pills(item.tools)}</section>`,
        next: nextOf(experience, i, '/experience', (x) => `${x.role}, ${x.company}`),
    });
}

export function projectDetail(item) {
    const i = projects.indexOf(item);
    return docShell({
        back: '/projects',
        eyebrow: `Projects · ${item.group}`,
        title: item.title,
        meta: [['Focus', item.meta]],
        figure: `<img src="${item.image}" alt="" loading="lazy" decoding="async">`,
        figureClass: 'is-image is-wide',
        body: `
            <p class="lede">${item.summary}</p>
            ${item.sections.map((s) => `<section><h2>${s.title}</h2>${rich(s.body)}</section>`).join('')}
            ${item.documents.length ? `<section><h2>Documents</h2><p class="doc-links">${item.documents.map((d) => `<a href="${d.href}" target="_blank" rel="noopener">${d.label}</a>`).join('')}</p></section>` : ''}`,
        next: nextOf(projects, i, '/projects', (x) => x.title.split(': ').slice(1).join(': ') || x.title),
    });
}

/* --------------------------------------------------------------- profile */

export function profilePage() {
    const sections = [
        ['about', 'About'], ['effective-altruism', 'Effective altruism'], ['now', 'Now'],
        ['volunteering', 'Volunteering'], ['education', 'Education'], ['skills', 'Skills'], ['contact', 'Contact'],
    ];
    return `
        ${chrome({ back: '/' })}
        <div class="dir profile">
            <aside class="dir-side">
                <h1 class="dir-title">Profile</h1>
                <nav class="dir-cats is-links" aria-label="On this page">
                    ${sections.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('')}
                </nav>
            </aside>
            <div class="dir-main prose">
                <section id="about">
                    <h2 class="section-label">About</h2>
                    ${thesis.map((p, i) => `<p${i === 0 ? ' class="lede"' : ''}>${p}</p>`).join('')}
                    ${profile.about.map((p) => `<p>${p}</p>`).join('')}
                </section>
                <section id="effective-altruism" class="ea" aria-labelledby="ea-h">
                    <h2 class="ea-title" id="ea-h">Effective altruism</h2>
                    <p class="ea-lede lede">${profile.ea.lede}</p>
                    ${profile.ea.body.map((p) => `<p>${p}</p>`).join('')}
                    <ul class="ledger ea-ledger">
                        ${profile.ea.involvement.map((c) => `<li><span class="lg-main">${c.href ? `<a href="${c.href}">${c.name}</a>` : c.name}</span><span class="lg-what">${c.what}</span><span class="lg-where">${c.where}</span></li>`).join('')}
                    </ul>
                </section>
                <section id="now">
                    <h2 class="section-label">Now</h2>
                    ${nowList(now)}
                </section>
                <section id="volunteering">
                    <h2 class="section-label">Volunteering</h2>
                    <ul class="ledger">
                        ${profile.volunteering.map((c) => `<li><span class="lg-main">${c.name}</span><span class="lg-what">${c.what}</span><span class="lg-where">${c.where}</span></li>`).join('')}
                    </ul>
                </section>
                <section id="education">
                    <h2 class="section-label">Education</h2>
                    <ul class="ledger">
                        ${profile.education.map((e) => `<li><span class="lg-main">${e.school}</span><span class="lg-what">${e.degree}<br><small>${e.note}</small>${e.extra ? `<br><small>${e.extra}</small>` : ''}</span><span class="lg-where">${e.when}</span></li>`).join('')}
                    </ul>
                </section>
                <section id="skills">
                    <h2 class="section-label">Skills</h2>
                    <div class="skill-groups">
                        ${profile.skills.map((g) => `<div><h3>${g.group}</h3>${pills(g.items)}</div>`).join('')}
                    </div>
                </section>
                <section id="contact">
                    <h2 class="section-label">Contact</h2>
                    <p class="contact-line"><a href="mailto:${site.email}">${site.email}</a></p>
                    <p class="doc-links">
                        <a href="${site.resume}" target="_blank" rel="noopener">Résumé (PDF)</a>
                        ${site.social.map((s) => `<a href="${s.href}" target="_blank" rel="noopener noreferrer">${s.label}</a>`).join('')}
                    </p>
                </section>
            </div>
        </div>
        ${footer()}`;
}

/* ------------------------------------------------------------------ 404 */

export function notFound() {
    return `
        ${chrome({ back: '/', backLabel: 'home' })}
        <div class="lost">
            <p class="eyebrow">404</p>
            <h1 class="doc-title">This page does not exist</h1>
            <p>The link may be old. Everything on the site is one click from the home page.</p>
            <a class="pill pill-solid" href="/">Go to the home page</a>
        </div>
        ${footer()}`;
}

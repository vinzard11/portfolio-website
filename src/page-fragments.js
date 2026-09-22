/**
 * @file page-fragments.js
 * @description Pure HTML-string builders shared by the client router and the
 * build-time prerenderer. Everything here must stay free of browser globals so
 * Node can import it during the build.
 */

import { slugify } from './slugify.js';
import { createWorkexDetailPageHTML } from './workex-detail-template.js';
import { createProjectDetailPageHTML } from './project-detail-template.js';

export const createModernWorkItemHTML = (exp) => {
    if (!exp.subpage) return '';

    const slug = exp.slug || slugify(exp.company);
    const tagsHTML = exp.tags.map((tag) => `<span class="workex-tag">${tag}</span>`).join('');
    const bulletsHTML = (exp.highlights || [])
        .map((point) => `<li>${point}</li>`)
        .join('');

    return `
        <li class="workex-entry scroll-fade">
            <div class="workex-entry-head">
                <div>
                    <h2 class="workex-entry-role">${exp.role}</h2>
                    <p class="workex-entry-company">${exp.company}</p>
                </div>
                <p class="workex-entry-meta">
                    <span class="workex-entry-date">${exp.date}</span>
                    ${exp.location ? `<span class="workex-entry-location">${exp.location}</span>` : ''}
                </p>
            </div>
            ${bulletsHTML ? `<ul class="workex-entry-points">${bulletsHTML}</ul>` : ''}
            <div class="workex-entry-foot">
                <div class="workex-item-tags">${tagsHTML}</div>
                <a href="/workex/${slug}" class="workex-entry-link router-link">Read more about this role &rarr;</a>
            </div>
        </li>
    `;
};

export const createProjectCardHTML = (proj) => `
        <a href="/projects/${slugify(proj.title)}" class="gradient-border-card router-link scroll-fade" data-category="${proj.category}">
            <div class="project-card-image">
                <img src="/images/${proj.image}" alt="${proj.title}" loading="lazy">
            </div>
            <div class="project-card-body">
                <span class="project-card-tag">${proj.category}</span>
                <h3>${proj.title}</h3>
                <p class="project-card-description">${proj.description}</p>
            </div>
        </a>
    `;

export const createFilterPillsHTML = (categories) => {
    const allPill = `<button type="button" class="filter-pill active" data-filter="all">All</button>`;
    const categoryPills = categories
        .map((cat) => `<button type="button" class="filter-pill" data-filter="${cat}">${cat}</button>`)
        .join('');
    return allPill + categoryPills;
};

/** Renders a detail route's markup. Every work role uses the same layout. */
export function createDetailHTML(route) {
    return route.kind === 'project'
        ? createProjectDetailPageHTML(route.item)
        : createWorkexDetailPageHTML(route.item);
}

/** Markup for the not-found state, shared by the prerenderer and the router. */
export const notFoundHTML = `
        <div class="container mx-auto px-6 py-24 text-center">
            <h1 class="text-4xl md:text-5xl font-bold text-text-dark mb-4">Page not found</h1>
            <p class="text-lg text-text-light mb-8">That link does not point anywhere on this site.</p>
            <a href="/" class="btn btn-outline router-link">Back to the home page</a>
        </div>
    `;

/** Body classes the route needs, matching what the client router applies. */
export function bodyClassesFor(path) {
    const classes = ['antialiased'];
    if (path.startsWith('/workex')) {
        classes.push('workex-page');
        if (path.startsWith('/workex/')) classes.push('workex-detail-page');
    } else if (path.startsWith('/projects')) {
        classes.push('projects-page');
        if (path.startsWith('/projects/')) classes.push('project-detail-page');
    }
    return classes.join(' ');
}

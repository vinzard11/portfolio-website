/**
 * @file routes.js
 * @description The site's route table. Imported by the client router at runtime
 * and by the build-time prerenderer in Node, so every route that exists in the
 * browser also gets a real HTML file on disk with its own title and description.
 *
 * Kept free of browser-only imports (no gsap, no three, no document) so Node can
 * import it directly during the build.
 */

import { workData, projectData } from './data.js';
import { slugify } from './slugify.js';

const SITE_NAME = 'Vinith Ayapilla';

/** Routes backed by a <template> element in index.html. */
export const staticRoutes = [
    {
        path: '/',
        templateId: 'page-home',
        title: `${SITE_NAME} | LLM systems, evaluation, and AI strategy`,
        description: 'Vinith Ayapilla builds and evaluates LLM systems, from on-premise deployment to the measurement problems underneath, and works on AI strategy and operations.',
    },
    {
        path: '/workex',
        templateId: 'page-workex',
        title: `Work Experience | ${SITE_NAME}`,
        description: 'AI evaluation and measurement at IEA TIMSS & PIRLS, data analysis at Boston College, and healthcare and pharmaceutical commercial data at ZS Associates.',
    },
    {
        path: '/research',
        templateId: 'page-research',
        title: `Research | ${SITE_NAME}`,
        description: 'Papers on LLM comparative judgment and item-difficulty estimation, plus independent education-policy and AI-safety analysis.',
    },
    {
        path: '/projects',
        templateId: 'page-projects',
        title: `Projects | ${SITE_NAME}`,
        description: 'Strategy, product, and technical projects from an MBA at Boston College and earlier engineering work.',
    },
    {
        path: '/resume',
        templateId: 'page-resume',
        title: `Résumé | ${SITE_NAME}`,
        description: 'Experience, education, and skills for Vinith Ayapilla, available on the page or as a PDF.',
    },
];

/** Routes rendered from data by a template function. */
export const detailRoutes = [
    ...workData
        .filter((item) => item.subpage)
        .map((item) => ({
            // Two roles share one company name, so entries carry an explicit slug.
            path: `/workex/${item.slug || slugify(item.company)}`,
            kind: 'workex',
            item,
            title: `${item.role} at ${item.company} | ${SITE_NAME}`,
            description: item.summary,
        })),
    ...projectData.map((item) => ({
        path: `/projects/${slugify(item.title)}`,
        kind: 'project',
        item,
        title: `${item.title} | ${SITE_NAME}`,
        description: item.description,
    })),
];

export const allRoutes = [...staticRoutes, ...detailRoutes];

/**
 * Served for any path that matches nothing. Deliberately not in allRoutes: it
 * must never appear in the sitemap or be linked to.
 */
export const notFoundRoute = {
    path: '/404',
    notFound: true,
    title: `Page not found | ${SITE_NAME}`,
    description: 'That page does not exist.',
};

/** Resolves a pathname to a route descriptor, or null for a 404. */
export function matchRoute(pathname) {
    const path = pathname.replace(/\/+$/, '') || '/';
    return allRoutes.find((r) => r.path === path) || null;
}

/**
 * @file routes.js
 * @description The route table. Each route renders its own markup, so the
 * browser router and the build-time prerenderer cannot disagree about a page.
 * Free of browser globals so Node can import it during the build.
 */

import { experience, research, projects } from './content.js';
import * as pages from './pages.js';

const NAME = 'Vinith Ayapilla';

export const staticRoutes = [
    {
        path: '/',
        page: 'home',
        title: `${NAME} | AI evaluation, measurement and safety`,
        description: 'Vinith Ayapilla is an engineer who works on measurement: whether we can trust what a language model says, how we would know, and how to run models responsibly on our own hardware.',
        render: pages.home,
    },
    {
        path: '/research',
        page: 'directory',
        title: `Research | ${NAME}`,
        description: 'Papers on LLM comparative judgment and item-difficulty estimation, an AI safety benchmarking study, and an education policy analysis of Kosovo.',
        render: pages.researchIndex,
    },
    {
        path: '/experience',
        page: 'experience',
        title: `Experience | ${NAME}`,
        description: 'AI evaluation and front-end engineering at the TIMSS & PIRLS International Study Center, data analysis at Boston College, and commercial pharma data at ZS Associates.',
        render: pages.experienceIndex,
    },
    {
        path: '/projects',
        page: 'directory',
        title: `Projects | ${NAME}`,
        description: 'Strategy, product and technical projects from an MBA at Boston College and earlier engineering work.',
        render: pages.projectsIndex,
    },
    {
        path: '/profile',
        page: 'profile',
        title: `Profile | ${NAME}`,
        description: 'About Vinith Ayapilla: background, the effective altruism community, current work, volunteering, education and skills.',
        render: pages.profilePage,
    },
];

export const detailRoutes = [
    ...research.filter((r) => r.body).map((r) => ({
        path: `/research/${r.slug}`,
        page: 'doc',
        title: `${r.short || r.title} | ${NAME}`,
        description: `${r.summary} ${r.venue ? `${r.venue}, ` : ''}${r.status.toLowerCase()}.`,
        render: () => pages.researchDetail(r),
    })),
    ...experience.map((e) => ({
        path: `/experience/${e.slug}`,
        page: 'doc',
        title: `${e.role}, ${e.company} | ${NAME}`,
        description: e.summary,
        render: () => pages.experienceDetail(e),
    })),
    ...projects.map((p) => ({
        path: `/projects/${p.slug}`,
        page: 'doc',
        title: `${p.title} | ${NAME}`,
        description: p.summary,
        render: () => pages.projectDetail(p),
    })),
];

export const allRoutes = [...staticRoutes, ...detailRoutes];

/** Served for any unmatched path. Never listed in the sitemap. */
export const notFoundRoute = {
    path: '/404',
    page: 'doc',
    notFound: true,
    title: `Page not found | ${NAME}`,
    description: 'That page does not exist.',
    render: pages.notFound,
};

export function matchRoute(pathname) {
    const path = pathname.replace(/\/+$/, '') || '/';
    return allRoutes.find((r) => r.path === path) || null;
}

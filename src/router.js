/**
 * @file router.js
 * @description Handles routing and content rendering for the portfolio website.
 */

import gsap from 'gsap';
import { workData, projectData } from './data.js';
import { slugify } from './slugify.js';
import {
    initializeHomePageAnimations,
    cleanupPageAnimations,
    initInteractiveCards,
    initWorkexDetailAnimations,
    initWorkexPageAnimations,
    initGsapScrollTriggers, // <-- IMPORTED new function
    initProjectFilters,
    initHomeHeroScene
} from './animations.js';
import { matchRoute, notFoundRoute } from './routes.js';
import {
    createModernWorkItemHTML,
    createProjectCardHTML,
    createFilterPillsHTML,
    createDetailHTML,
    bodyClassesFor,
    notFoundHTML
} from './page-fragments.js';

const appRoot = document.getElementById('app-root');

function tweenOverlay(vars) {
    return new Promise((resolve) => {
        gsap.to('#page-transition-overlay', { ...vars, onComplete: resolve });
    });
}

async function playPageTransition(targetPageId, direction) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (direction === 'out') {
        await tweenOverlay({ opacity: 1, pointerEvents: 'auto', duration: 0.15, ease: 'power1.in' });
    } else {
        await tweenOverlay({ opacity: 0, pointerEvents: 'none', duration: 0.25, ease: 'power1.out' });
    }
}

function initializePageListeners() {
    document.querySelectorAll('.router-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = e.currentTarget.getAttribute('href');
            if (window.location.pathname !== path) {
                history.pushState(null, '', path);
                loadContent(path);
            }
        });
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
        // OPTIMIZATION: Replaced IntersectionObserver with more robust GSAP ScrollTrigger
        initGsapScrollTriggers();
        initInteractiveCards();
    } else {
        // Fallback for reduced motion
        document.querySelectorAll('.scroll-fade, .scroll-reveal').forEach(el => el.classList.add('animate-in'));
    }
    
    document.querySelectorAll('.view-pdf-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const src = button.dataset.pdfSrc;
            const title = button.dataset.pdfTitle;
            const pdfModal = document.getElementById('pdf-viewer-modal');
            const pdfIframe = document.getElementById('pdf-iframe');
            const pdfTitle = document.getElementById('pdf-title');
            if (src && src !== '#' && pdfModal && pdfIframe && pdfTitle) {
                pdfTitle.textContent = title;
                pdfIframe.src = src;
                pdfModal.classList.add('visible');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    initProjectFilters();
}

const updateActiveLink = (path) => {
    // "/" must not light up every link, so the root is matched exactly and every
    // other section matches its own path plus anything nested beneath it.
    const section = '/' + (path.split('/')[1] || '');
    document.querySelectorAll('header .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === section && section !== '/');
    });
};

export async function loadContent(path) {
    cleanupPageAnimations();

    const pathname = (path || '/').split('#')[0].split('?')[0];
    // An unmatched path must stay unmatched. Falling back to the home route here
    // would render the homepage under a URL that does not exist.
    const route = matchRoute(pathname) || notFoundRoute;
    const normalized = route.path;

    await playPageTransition(normalized, 'out');

    document.body.className = bodyClassesFor(normalized);

    // The build prerenders every route into #app-root. On the very first load we
    // adopt that markup instead of rebuilding it, which avoids a wipe-and-repaint
    // flash of content the visitor can already see.
    const adopting = appRoot.dataset.prerendered === normalized;
    if (adopting) {
        delete appRoot.dataset.prerendered;
    } else {
        appRoot.innerHTML = '';
    }

    if (route.notFound) {
        if (!adopting) appRoot.innerHTML = notFoundHTML;
    } else if (route.kind) {
        if (!adopting) appRoot.innerHTML = createDetailHTML(route);
        initWorkexDetailAnimations();
    } else {
        if (!adopting) {
            const template = document.getElementById(route.templateId);
            if (template) appRoot.appendChild(template.content.cloneNode(true));
        }

        if (route.templateId === 'page-workex' && !adopting) {
            const container = document.getElementById('workex-list');
            if (container) {
                container.innerHTML = workData.map(createModernWorkItemHTML).join('');
            }
        }
        if (route.templateId === 'page-workex') initWorkexPageAnimations();

        if (route.templateId === 'page-projects' && !adopting) {
            const grid = document.getElementById('projects-grid');
            const filters = document.querySelector('.project-filters');
            if (grid) grid.innerHTML = projectData.map(createProjectCardHTML).join('');
            if (filters) {
                const categories = [...new Set(projectData.map(proj => proj.category))];
                filters.innerHTML = createFilterPillsHTML(categories);
            }
        }

        if (route.templateId === 'page-home') {
            initHomeHeroScene();
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                initializeHomePageAnimations();
            }
        }
    }

    updateActiveLink(normalized);
    if (!adopting) setTimeout(() => window.scrollTo(0, 0), 0);
    initializePageListeners();

    await playPageTransition(normalized, 'in');
}

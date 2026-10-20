/**
 * @file app.js
 * @description Client entry. Every route is prerendered, so this only adds
 * in-place navigation between pages and the behaviors in behaviors.js.
 */

import './style.css';
import { matchRoute, notFoundRoute } from './routes.js';
import { initGlobal, initPage } from './behaviors.js';

const SITE = 'https://vin-ayapilla-portfolio.vercel.app';
const root = document.getElementById('app-root');

// Hash URLs handed out by earlier versions of the site.
const LEGACY = { home: '/', workex: '/experience', projects: '/projects', resume: '/profile', research: '/research' };

const setAttr = (selector, attr, value) => document.querySelector(selector)?.setAttribute(attr, value);

function applyMeta(route, pathname) {
    const url = pathname === '/' ? `${SITE}/` : `${SITE}${pathname}`;
    document.title = route.title;
    setAttr('meta[name="description"]', 'content', route.description);
    setAttr('link[rel="canonical"]', 'href', url);
    setAttr('meta[property="og:url"]', 'content', url);
    setAttr('meta[property="og:title"]', 'content', route.title);
    setAttr('meta[property="og:description"]', 'content', route.description);
    setAttr('meta[name="twitter:title"]', 'content', route.title);
    setAttr('meta[name="twitter:description"]', 'content', route.description);
}

history.scrollRestoration = 'manual';

/* ------------------------------------------------------------ analytics */

// Vercel Web Analytics: cookieless, country-level. The site swaps pages in
// place, so automatic tracking is switched off and every page view is reported
// explicitly, the same way Vercel's own framework integrations do it.
const ANALYTICS_ON = !/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname);

function loadAnalytics() {
    if (!ANALYTICS_ON) return;
    const s = document.createElement('script');
    s.defer = true;
    s.src = '/_vercel/insights/script.js';
    s.dataset.disableAutoTrack = '1';
    document.head.appendChild(s);
}

function trackPageview(route, pathname) {
    if (!ANALYTICS_ON) return;
    window.va?.('pageview', { route: route.notFound ? '/404' : route.path, path: pathname });
}

function scrollForHash(hash) {
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return window.scrollTo(0, 0);
    // Experience panels are sticky, so scroll to the in-flow anchor's exact top
    // rather than letting scroll-padding pull the previous panel into view.
    if (target.classList.contains('panel-anchor')) {
        window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY);
    } else {
        target.scrollIntoView();
    }
}

function render(pathname, hash, restoreY = null) {
    const route = matchRoute(pathname) || notFoundRoute;
    root.innerHTML = route.render();
    document.body.dataset.page = route.page;
    applyMeta(route, pathname);
    trackPageview(route, pathname);
    if (restoreY !== null) window.scrollTo(0, restoreY);
    else scrollForHash(hash);
    initPage(root);
    // Move focus to the new page's heading for screen-reader and keyboard users.
    const h1 = root.querySelector('h1');
    if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
}

function go(pathname, hash = '', { push = true, restoreY = null } = {}) {
    if (push) {
        // Remember where we were, so the browser's back button can return here.
        history.replaceState({ ...(history.state || {}), y: window.scrollY }, '');
        history.pushState(null, '', pathname + hash);
    }
    const swap = () => render(pathname, hash, restoreY);
    const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && motionOk) document.startViewTransition(swap);
    else swap();
}

document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    // Same-page anchors (#now, #about) are left to the browser.
    if (url.pathname === location.pathname && url.hash) return;
    // Only intercept real pages; PDFs and images load normally.
    if (!matchRoute(url.pathname)) return;
    e.preventDefault();
    go(url.pathname, url.hash);
});

let lastPath = location.pathname;
window.addEventListener('popstate', () => {
    if (location.pathname === lastPath) return;
    lastPath = location.pathname;
    go(location.pathname, location.hash, { push: false, restoreY: history.state?.y ?? null });
});
const _push = history.pushState.bind(history);
history.pushState = (...args) => { _push(...args); lastPath = location.pathname; };

/* ---------------------------------------------------------------- boot */

initGlobal();
loadAnalytics();

const legacy = location.hash.replace(/^#/, '');
if (location.pathname === '/' && legacy in LEGACY) {
    history.replaceState(null, '', LEGACY[legacy]);
    lastPath = location.pathname;
}

const bootRoute = matchRoute(location.pathname) || notFoundRoute;
if (root.dataset.prerendered === bootRoute.path) {
    // The build already put this page's markup in place; just wire it up.
    delete root.dataset.prerendered;
    document.body.dataset.page = bootRoute.page;
    trackPageview(bootRoute, location.pathname);
    initPage(root);
} else {
    render(location.pathname, location.hash);
}

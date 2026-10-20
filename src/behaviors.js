/**
 * @file behaviors.js
 * @description Progressive enhancements. Every page is complete without this
 * file; it adds the menu overlay, the live clock, directory previews and filters,
 * and the home-page portrait.
 */

import { initPortrait } from './portrait.js';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* -------------------------------------------------------------- cursor */

/**
 * The inverting circle from the previous version of the site. Mouse and
 * trackpad only: touch devices and keyboard users keep the system behavior,
 * and without JavaScript the native cursor is never hidden.
 */
function initCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = document.createElement('div');
    el.className = 'cursor';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<span class="cursor-dot"></span>';
    document.body.appendChild(el);
    document.documentElement.classList.add('has-cursor');

    const follow = reducedMotion() ? 1 : 0.32;
    let x = -100, y = -100, cx = x, cy = y, raf = 0;
    const tick = () => {
        cx += (x - cx) * follow;
        cy += (y - cy) * follow;
        el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
        raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.2 ? requestAnimationFrame(tick) : 0;
    };
    document.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        x = e.clientX; y = e.clientY;
        if (!el.classList.contains('is-visible')) { cx = x; cy = y; el.classList.add('is-visible'); }
        const t = e.target instanceof Element ? e.target : null;
        el.classList.toggle('is-link', !!t?.closest('a, button, [role="button"], label'));
        // Over the portrait the photo lens takes over, so the circle shrinks to a point.
        el.classList.toggle('is-lens', !!t?.closest('.portrait.is-live') && !t?.closest('a, button'));
        if (!raf) raf = requestAnimationFrame(tick);
    });
    document.documentElement.addEventListener('mouseleave', () => el.classList.remove('is-visible'));
    document.addEventListener('mousedown', () => el.classList.add('is-down'));
    document.addEventListener('mouseup', () => el.classList.remove('is-down'));
}

/* ---------------------------------------------------------------- menu */

let lastFocus = null;

function openMenu(trigger) {
    const menu = document.querySelector('[data-menu]');
    if (!menu) return;
    lastFocus = trigger || document.activeElement;
    menu.hidden = false;
    document.documentElement.classList.add('menu-open');
    document.querySelectorAll('[data-menu-open]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
    menu.querySelector('.menu-nav a')?.focus();
}

export function closeMenu() {
    // Always release the scroll lock. Navigating from the menu swaps in a new
    // page whose menu is already hidden, so checking only that menu would leave
    // the lock on and freeze the new page.
    document.documentElement.classList.remove('menu-open');
    const menu = document.querySelector('[data-menu]');
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    document.querySelectorAll('[data-menu-open]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
}

/* --------------------------------------------------------------- theme */

const THEME_COLOR = { light: '#e6efe7', dark: '#121815' };
const currentTheme = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

function syncToggles() {
    const dark = currentTheme() === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.setAttribute('aria-pressed', String(dark)));
}

function applyTheme(theme, { save }) {
    const set = () => {
        document.documentElement.dataset.theme = theme;
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
        syncToggles();
        window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
    };
    if (document.startViewTransition && !reducedMotion()) document.startViewTransition(set);
    else set();
    if (save) { try { localStorage.setItem('theme', theme); } catch { /* private mode */ } }
}

function initTheme() {
    syncToggles();
    document.addEventListener('click', (e) => {
        if (!e.target.closest('[data-theme-toggle]')) return;
        applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', { save: true });
    });
    // Until a visitor picks a theme, keep following their system setting.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        let saved = null;
        try { saved = localStorage.getItem('theme'); } catch { /* private mode */ }
        if (!saved) applyTheme(e.matches ? 'dark' : 'light', { save: false });
    });
}

/** Global listeners, attached once. Page content is swapped underneath them. */
export function initGlobal() {
    initCursor();
    initTheme();
    document.addEventListener('click', (e) => {
        const open = e.target.closest('[data-menu-open]');
        if (open) { e.preventDefault(); openMenu(open); return; }
        if (e.target.closest('[data-menu-close]')) { e.preventDefault(); closeMenu(); }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}

/* ---------------------------------------------------- per-page lifecycle */

let disposers = [];
const onDispose = (fn) => disposers.push(fn);

export function disposePage() {
    disposers.forEach((fn) => { try { fn(); } catch { /* already gone */ } });
    disposers = [];
}

function initClock(root) {
    const el = root.querySelector('[data-clock]');
    if (!el) return;
    const fmt = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York', weekday: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
    });
    const tick = () => {
        const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
        el.textContent = `${parts.weekday} ${parts.day} · ${parts.hour}:${parts.minute}`;
    };
    tick();
    const id = setInterval(tick, 15000);
    onDispose(() => clearInterval(id));
}

function initDirectory(root) {
    const list = root.querySelector('[data-directory]');
    if (!list) return;
    const main = list.closest('.dir-main');
    const preview = main.querySelector('.dir-preview');
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let current = null;
    const show = (row) => {
        if (!canHover || !preview) return;
        const slug = row.dataset.preview;
        if (current !== slug) {
            const tpl = list.querySelector(`template[data-preview-for="${slug}"]`);
            preview.replaceChildren(tpl ? tpl.content.cloneNode(true) : '');
            current = slug;
        }
        // Float the preview so its top sits a little above the hovered row.
        const top = row.getBoundingClientRect().top - main.getBoundingClientRect().top;
        preview.style.setProperty('--pv-top', `${Math.max(0, top - 36)}px`);
        preview.classList.add('is-visible');
    };
    const hide = () => preview?.classList.remove('is-visible');

    list.querySelectorAll('[data-preview]').forEach((row) => {
        row.addEventListener('mouseenter', () => show(row));
        row.addEventListener('focus', () => show(row));
        row.addEventListener('mouseleave', hide);
        row.addEventListener('blur', hide);
    });

    // Category filter. Without JS every row is simply visible.
    const side = root.querySelector('.dir-cats[role="group"]');
    side?.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-filter]');
        if (!btn) return;
        const f = btn.dataset.filter;
        side.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        list.querySelectorAll('li[data-group]').forEach((li) => { li.hidden = f !== 'all' && li.dataset.group !== f; });
        hide();
    });
}

export function initPage(root) {
    disposePage();
    closeMenu();
    syncToggles();
    initClock(root);
    initDirectory(root);
    initPortrait(root, onDispose);
}

/**
 * @file ui.js
 * @description Chrome shared by every inner page: the back pill and menu button
 * (top corners), the menu overlay, and the contact corners at the bottom.
 * Pure string builders, usable from the browser and from the prerenderer.
 */

import { site } from './content.js';

export const esc = (s = '') => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Authored copy uses **bold** and blank-line paragraph breaks. */
export const rich = (text) => text
    .split(/\n\s*\n/)
    .map((p) => `<p>${p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`)
    .join('');

const NAV = [
    { href: '/research', label: 'Research', note: 'Papers & evaluations' },
    { href: '/experience', label: 'Experience', note: 'Four roles' },
    { href: '/profile', label: 'Profile', note: 'About, effective altruism, skills' },
    { href: '/projects', label: 'Projects', note: 'MBA & earlier' },
];

const socialLinks = () => site.social
    .map((s) => `<a href="${s.href}" target="_blank" rel="noopener noreferrer">${s.label}</a>`)
    .join('');

/** Top corners: a "back" pill on the left, the menu button on the right. */
export function chrome({ back = '/', backLabel = 'back', label = '' } = {}) {
    return `
        <div class="chrome">
            <a class="pill" href="${back}">${backLabel}</a>
            ${label ? `<span class="chrome-label">${label}</span>` : ''}
            <button class="menu-btn" type="button" data-menu-open aria-controls="menu" aria-expanded="false">
                <span class="sr-only">Open menu</span><span class="menu-bars" aria-hidden="true"><i></i><i></i><i></i></span>
            </button>
        </div>
        ${menu()}`;
}

/** Full-screen menu. Hidden until opened; plain links keep working without JS via the corners and back pill. */
export function menu() {
    return `
        <div class="menu" id="menu" hidden data-menu role="dialog" aria-modal="true" aria-label="Site menu">
            <div class="menu-top">
                <a class="pill" href="/">home</a>
                <button class="pill" type="button" data-menu-close>close</button>
            </div>
            <nav class="menu-nav" aria-label="Site">
                ${NAV.map((n, i) => `
                    <a href="${n.href}"><span class="menu-n">0${i + 1}</span><span class="menu-label">${n.label}</span><span class="menu-note">${n.note}</span></a>`).join('')}
            </nav>
            <div class="menu-foot">
                <a href="${site.resume}" target="_blank" rel="noopener">Résumé (PDF)</a>
                <span>${esc(site.email)}</span>
                <span class="menu-social">${socialLinks()}</span>
            </div>
        </div>`;
}

/** Bottom corners: email and collaboration note left, profiles right. */
export function footer({ fixed = false } = {}) {
    return `
        <footer class="corners${fixed ? ' is-fixed' : ''}">
            <div class="corners-left">
                <a class="corners-email" href="mailto:${site.email}">${esc(site.email)}</a>
                <span>${site.collaboration}</span>
            </div>
            <nav class="corners-right" aria-label="Profiles">${socialLinks()}</nav>
        </footer>`;
}

export const pills = (items) => `<ul class="pills">${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;

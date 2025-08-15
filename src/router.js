/**
 * @file router.js
 * @description Handles routing and content rendering for the portfolio website.
 */

import { workData, projectData } from './data.js';
import { initializeHomePageAnimations, cleanupPageAnimations, initInteractiveCards } from './animations.js';

const appRoot = document.getElementById('app-root');

const createVisualHTML = (visual) => {
    if (!visual) return '';
    switch (visual.type) {
        case 'stat': return `<div class="text-center"><p class="text-4xl font-bold text-primary">${visual.value}</p><p class="text-xs text-text-light uppercase tracking-wider">${visual.label}</p></div>`;
        case 'circle': return `<div class="relative w-24 h-24"><svg class="w-full h-full" viewBox="0 0 36 36"><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(0,0,0,0.05)" stroke-width="3"></path><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#circleGradient)" stroke-width="3" stroke-dasharray="${visual.value}, 100" stroke-linecap="round"></path><defs><linearGradient id="circleGradient" gradientTransform="rotate(90)"><stop offset="0%" stop-color="${'var(--color-accent)'}" /><stop offset="100%" stop-color="${'var(--color-primary)'}" /></linearGradient></defs></svg><div class="absolute inset-0 flex flex-col items-center justify-center"><span class="text-xl font-bold text-text-dark">${visual.value}%</span><span class="text-xs text-text-light">${visual.label}</span></div></div>`;
        case 'icon': return `<div class="text-primary"><svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>`;
        default: return '';
    }
};

const createWorkItemHTML = (exp, index) => {
    const isReversed = index % 2 !== 0;
    const alignmentClass = isReversed ? 'md:flex-row-reverse' : '';
    const textAlignClass = isReversed ? 'md:text-left md:pl-12' : 'md:text-right md:pr-12';

    let contentHTML = '';
    if (exp.projects) {
        contentHTML = `
            <div class="space-y-4 text-left">
                ${exp.projects.map(proj => `
                    <div class="p-4 rounded-lg bg-white/50 border border-slate-200 expandable-item">
                        <div class="flex gap-4 items-center cursor-pointer toggle-summary">
                            <div class="flex-shrink-0 w-24 flex justify-center">${createVisualHTML(proj.visual)}</div>
                            <div class="flex-grow">
                                <h4 class="font-semibold text-text-dark" style="font-family: 'Montserrat', sans-serif;">${proj.title}</h4>
                            </div>
                            <div class="toggle-icon text-primary text-2xl font-light ml-2">+</div>
                        </div>
                        <div class="details-content">
                            <p class="text-text-light">${proj.details}</p>
                        </div>
                    </div>
                `).join('')}
            </div>`;
    } else if (exp.details) {
        contentHTML = `<p class="text-text-light text-left">${exp.details}</p>`;
    }

    return `
        <div class="relative pl-12 md:pl-0 mb-24 scroll-fade">
            <div class="md:flex items-start ${alignmentClass}">
                <div class="md:w-1/2 ${textAlignClass} expandable-item">
                    <div class="cursor-pointer toggle-summary">
                        <p class="text-lg font-semibold text-primary" style="font-family: 'Montserrat', sans-serif;">${exp.date}</p>
                        <h2 class="text-3xl font-bold text-text-dark mt-1">${exp.company}</h2>
                        <h3 class="text-xl font-semibold text-text-light mb-3" style="font-family: 'Montserrat', sans-serif;">${exp.role}</h3>
                        <p class="text-text-light mt-2">${exp.summary}</p>
                        <div class="flex-shrink-0 w-full flex ${isReversed ? 'justify-start' : 'md:justify-end'} mt-4">
                            ${exp.visual ? createVisualHTML(exp.visual) : ''}
                        </div>
                        <div class="absolute top-4 ${isReversed ? 'md:left-full md:ml-8' : 'md:right-full md:mr-8'} right-4 toggle-icon text-primary text-3xl font-light">+</div>
                    </div>
                    <div class="details-content">
                        ${contentHTML}
                    </div>
                </div>
            </div>
            <div class="absolute left-4 top-1 h-4 w-4 bg-primary rounded-full border-4 border-white transform -translate-x-1/2 md:left-1/2"></div>
        </div>`;
};

const createProjectCardHTML = (proj, index) => {
    const docButtons = proj.documents.map(doc => 
        `<button class="btn text-sm mt-2 mr-2 view-pdf-btn" data-pdf-src="${doc.url}" data-pdf-title="${doc.name}">${doc.name}</button>`
    ).join('');

    return `
        <div class="gradient-border-card p-6 flex flex-col scroll-fade delay-${(index % 3) + 1} expandable-item">
            <div class="cursor-pointer toggle-summary flex-grow">
                <div class="flex justify-between items-start">
                    <h3 class="text-2xl font-bold text-text-dark mb-2">${proj.title}</h3>
                    <div class="toggle-icon text-primary text-2xl font-light ml-2">+</div>
                </div>
                <p class="text-text-light">${proj.summary}</p>
            </div>
            <div class="details-content">
                <p class="text-text-light">${proj.details}</p>
                <div class="mt-4">
                    ${docButtons}
                </div>
            </div>
        </div>
    `;
};

function initializePageListeners() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('animate-in');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.scroll-fade').forEach(el => observer.observe(el));
        
        // NEW: Initialize the new card animations
        initInteractiveCards();
    } else {
        document.querySelectorAll('.scroll-fade').forEach(el => el.classList.add('animate-in'));
    }

    document.querySelectorAll('.expandable-item').forEach(item => {
        const button = item.querySelector('.toggle-summary');
        if(button) {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const content = item.querySelector('.details-content');
                item.classList.toggle('open');
                if(content) content.classList.toggle('open');
            });
        }
    });
    
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
}

const updateActiveLink = (path) => {
    document.querySelectorAll('header .nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === path);
    });
};

export function loadContent(path) {
    cleanupPageAnimations();

    const pageId = 'page-' + (path.substring(1) || 'home');
    const template = document.getElementById(pageId);
    
    appRoot.style.transition = 'opacity 0.3s ease-in-out';
    appRoot.style.opacity = 0;

    setTimeout(() => {
        if (template) {
            appRoot.innerHTML = '';
            const content = template.content.cloneNode(true);
            appRoot.appendChild(content);

            if (pageId === 'page-workex') {
                const container = document.getElementById('workex-timeline');
                if(container) container.innerHTML = `<div class="absolute left-1/2 -translate-x-1/2 top-0 w-1 bg-primary/20 h-full hidden md:block"></div>` + workData.map(createWorkItemHTML).join('');
            }
            if (pageId === 'page-projects') {
                const container = document.getElementById('projects-grid');
                if(container) container.innerHTML = projectData.map(createProjectCardHTML).join('');
            }

            if (pageId === 'page-home' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                initializeHomePageAnimations();
            } else {
                document.querySelectorAll('[data-animate]').forEach(el => el.style.opacity = 1);
            }

            updateActiveLink(path);
            window.scrollTo(0, 0);
            initializePageListeners();
        } else {
            loadContent('#home');
        }
        appRoot.style.opacity = 1;
    }, 300);
}
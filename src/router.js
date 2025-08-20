/**
 * @file router.js
 * @description Handles routing and content rendering for the portfolio website.
 */

import { workData, projectData } from './data.js';
import { 
    initializeHomePageAnimations, 
    cleanupPageAnimations, 
    initInteractiveCards, 
    initWorkexDetailAnimations,
    initWorkexPageAnimations 
} from './animations.js';
import { createWorkexDetailPageHTML } from './workex-detail-template.js';
import { createZsDetailPageHTML } from './zs-detail-template.js'; 
import { createWorkexSimplePageHTML } from './workex-simple-template.js';

const appRoot = document.getElementById('app-root');

async function playPageTransition(targetPageId, direction) {
    return; // Skipping transitions for now
}

// MODIFIED: Added isTransparent parameter
const createModernWorkItemHTML = (exp, isTransparent) => {
    if (!exp.subpage) return '';

    const tagsHTML = exp.tags.map(tag => `<span class="workex-tag">${tag}</span>`).join('');
    const companySlug = exp.company.toLowerCase().replace(/\s+/g, '-');
    // Conditionally add the transparent class
    const itemClass = `workex-item router-link scroll-fade ${isTransparent ? 'workex-item' : ''}`;
    
    return `
        <a href="#workex/${companySlug}" class="${itemClass}">
            <div class="workex-item-info">
                <h2 class="workex-item-title">${exp.role}</h2>
                <p class="workex-item-company">${exp.company}</p>
            </div>
            <div class="workex-item-tags">
                ${tagsHTML}
            </div>
        </a>
    `;
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
    document.querySelectorAll('.router-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = e.currentTarget.hash;
            if (window.location.hash !== path) {
                history.pushState(null, '', path);
                loadContent(path);
            }
        });
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('animate-in');
            });
        }, { threshold: 0.2 }); 

        document.querySelectorAll('.scroll-fade, .scroll-reveal').forEach(el => observer.observe(el));
        
        initInteractiveCards();
    } else {
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

    document.querySelectorAll('.expandable-item').forEach(item => {
        const toggle = item.querySelector('.toggle-summary');
        if (toggle) {
            toggle.addEventListener('click', () => {
                item.classList.toggle('open');
                const details = item.querySelector('.details-content');
                if (details) {
                    details.classList.toggle('open');
                }
            });
        }
    });
}

const updateActiveLink = (path) => {
    document.querySelectorAll('header .nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href').startsWith(path));
    });
};

export async function loadContent(path) {
    cleanupPageAnimations();

    const hash = path.substring(1);
    const isWorkexDetailPage = hash.startsWith('workex/');
    
    let pageId = 'page-home'; 
    if (isWorkexDetailPage) {
        pageId = 'page-workex-detail';
    } else if (hash) {
        pageId = 'page-' + hash;
    }

    await playPageTransition(pageId, 'out');

    document.body.className = 'antialiased'; // Reset body classes

    if (hash.startsWith('workex')) {
        document.body.classList.add('workex-page');
        if(isWorkexDetailPage) {
            document.body.classList.add('workex-detail-page');
        }
    }
    
    appRoot.innerHTML = ''; 

    if (isWorkexDetailPage) {
        const companySlug = hash.split('/')[1];
        const workItem = workData.find(item => item.company.toLowerCase().replace(/\s+/g, '-') === companySlug);
        
        if (companySlug === 'boston-college') {
            appRoot.innerHTML = createWorkexDetailPageHTML(workItem);
        } else if (companySlug === 'zs-associates') {
            appRoot.innerHTML = createZsDetailPageHTML(workItem);
        } else {
            appRoot.innerHTML = createWorkexSimplePageHTML(workItem);
        }
        
        initWorkexDetailAnimations();
    } else {
        const template = document.getElementById(pageId);
        if (template) {
            const content = template.content.cloneNode(true);
            appRoot.appendChild(content);

            if (pageId === 'page-workex') {
                const container = document.getElementById('workex-list');
                if(container) {
                    // MODIFIED: Logic to pass the isTransparent flag
                    container.innerHTML = workData.map((exp, index, arr) => {
                        const isTransparent = index >= arr.length - 2;
                        return createModernWorkItemHTML(exp, isTransparent);
                    }).join('');
                }
                initWorkexPageAnimations();
            }
            if (pageId === 'page-projects') {
                const container = document.getElementById('projects-grid');
                if(container) container.innerHTML = projectData.map(createProjectCardHTML).join('');
            }
            if (pageId === 'page-home' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                initializeHomePageAnimations();
            }
        } else {
            console.warn(`Template for ${pageId} not found. Loading home page.`);
            await loadContent('#home');
            return;
        }
    }
    
    updateActiveLink('#' + hash.split('/')[0]);
    window.scrollTo(0, 0);
    initializePageListeners();
    
    await playPageTransition(pageId, 'in');
}

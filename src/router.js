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
import { createBfinDetailPageHTML } from './bfin-detail-template.js';
import { createWorkexSimplePageHTML } from './workex-simple-template.js';
import { createProjectDetailPageHTML } from './project-detail-template.js';

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

const createProjectListItemHTML = (proj, index) => {
    const projectSlug = proj.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `
        <div class="project-item" data-index="${index}">
            <a href="#projects/${projectSlug}" class="router-link">${proj.title}</a>
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

    // Project page hover effect
    const projectListContainer = document.querySelector('.project-list-container');
    if (projectListContainer) {
        const projectItems = projectListContainer.querySelectorAll('.project-item');
        const hoverImages = document.querySelectorAll('.project-hover-image');

        projectItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const index = item.dataset.index;
                const image = document.getElementById(`project-image-${index}`);
                
                if (image) {
                    image.classList.add('visible');
                }
                projectListContainer.classList.add('is-hovered');
                item.classList.add('is-hovered');
            });

            item.addEventListener('mouseleave', () => {
                const index = item.dataset.index;
                const image = document.getElementById(`project-image-${index}`);

                if (image) {
                    image.classList.remove('visible');
                }
                projectListContainer.classList.remove('is-hovered');
                item.classList.remove('is-hovered');
            });
        });
    }
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
    const isProjectDetailPage = hash.startsWith('projects/');
    
    let pageId = 'page-home'; 
    if (isWorkexDetailPage) {
        pageId = 'page-workex-detail';
    } else if (isProjectDetailPage) {
        pageId = 'page-project-detail';
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
    } else if (hash.startsWith('projects')) {
        document.body.classList.add('projects-page');
        if(isProjectDetailPage) {
            document.body.classList.add('project-detail-page');
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
        } else if (companySlug === 'bfin') {
            appRoot.innerHTML = createBfinDetailPageHTML(workItem);
        } else {
            appRoot.innerHTML = createWorkexSimplePageHTML(workItem);
        }
        
        initWorkexDetailAnimations();
    } else if (isProjectDetailPage) {
        const projectSlug = hash.split('/')[1];
        const projectItem = projectData.find(item => item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === projectSlug);
        appRoot.innerHTML = createProjectDetailPageHTML(projectItem);
        // You might want a specific animation function for project detail pages
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
                const container = document.querySelector('.project-list-container');
                if(container) {
                    container.innerHTML = projectData.map(createProjectListItemHTML).join('');
                    
                    const imageContainer = document.createElement('div');
                    imageContainer.className = 'project-hover-images-container';
                    projectData.forEach((proj, index) => {
                        const posClass = (index + 1) % 2 !== 0 ? 'position-right' : 'position-left';
                        imageContainer.innerHTML += `<img id="project-image-${index}" src="./public/images/${proj.image}" class="project-hover-image ${posClass}" alt="${proj.title}">`;
                    });
                    container.parentNode.insertBefore(imageContainer, container);
                }
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
    // Use a timeout to ensure scrolling happens after the DOM is fully updated
    setTimeout(() => window.scrollTo(0, 0), 0);
    initializePageListeners();
    
    await playPageTransition(pageId, 'in');
}

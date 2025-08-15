/**
 * @file app.js
 * @description Main application logic for the portfolio website.
 * Initializes modules and sets up event listeners.
 */

import { initThreeJS } from './3d-background.js';
import { loadContent } from './router.js';
import { initCustomCursor, handleScroll } from './utils.js';

window.addEventListener('load', () => {
    // ===================================
    // DOM ELEMENTS
    // ===================================
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const pdfModal = document.getElementById('pdf-viewer-modal');
    const pdfModalClose = document.getElementById('pdf-modal-close');
    const preloader = document.getElementById('preloader');

    // ===================================
    // INITIALIZATION
    // ===================================
    preloader.classList.add('loaded');
    
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        initThreeJS();
        initCustomCursor();
    }

    // ===================================
    // EVENT LISTENERS
    // ===================================
    document.querySelectorAll('.router-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = e.currentTarget.hash;
            if (window.location.hash !== path) {
                history.pushState(null, '', path);
                loadContent(path);
            }
            if(mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
    
    window.addEventListener('popstate', () => loadContent(window.location.hash || '#home'));
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }

    const closeModal = () => {
        if (pdfModal) {
            pdfModal.classList.remove('visible');
            document.body.style.overflow = '';
            const pdfIframe = document.getElementById('pdf-iframe');
            if (pdfIframe) pdfIframe.src = '';
        }
    };

    if (pdfModalClose) pdfModalClose.addEventListener('click', closeModal);
    if (pdfModal) pdfModal.addEventListener('click', (e) => {
        if (e.target === pdfModal) closeModal();
    });

    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    
    window.addEventListener('scroll', handleScroll);

    // Initial content load
    loadContent(window.location.hash || '#home');
});

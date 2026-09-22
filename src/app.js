/**
 * @file app.js
 * @description Main application logic for the portfolio website.
 * Initializes modules and sets up event listeners.
 */

import './style.css';
import { loadContent } from './router.js';

window.addEventListener('load', async () => {
    // ===================================
    // DOM ELEMENTS
    // ===================================
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const pdfModal = document.getElementById('pdf-viewer-modal');
    const pdfModalClose = document.getElementById('pdf-modal-close');

    // ===================================
    // EVENT LISTENERS
    // ===================================
    document.querySelectorAll('.router-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = e.currentTarget.getAttribute('href');
            if (window.location.pathname !== path) {
                history.pushState(null, '', path);
                loadContent(path);
            }
            if(mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
    
    // Only re-render when the path actually changed; in-page "#section-N" anchors
    // on the detail pages also push history entries and must not remount the page.
    let lastPath = window.location.pathname;
    window.addEventListener('popstate', () => {
        if (window.location.pathname === lastPath) return;
        lastPath = window.location.pathname;
        loadContent(lastPath);
    });
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

    // The footer year is in the markup for crawlers; this keeps it honest over time.
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Legacy hash URLs (#workex, #projects, #resume) are what the previously
    // deployed site handed out, so translate them to real paths before routing.
    const legacy = window.location.hash.replace(/^#/, '');
    if (legacy && !legacy.startsWith('section-')) {
        const target = legacy === 'home' ? '/' : '/' + legacy;
        history.replaceState(null, '', target);
    }

    await loadContent(window.location.pathname);
});
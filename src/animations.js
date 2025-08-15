/**
 * @file animations.js
 * @description Manages all animations for the portfolio website.
 */

import { initHeroImage, cleanupHeroImage } from './hero-image.js';

let scrollTimeline = null;
let heroTextParallaxHandler = null;

export function animateHeroText() {
    if (typeof gsap === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.set('[data-animate]', { y: 30, opacity: 0 }); 
    const tl = gsap.timeline();
    tl.to('[data-animate="hero-title"]', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "+=0.3")
      .to('[data-animate="hero-subtitle"]', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.4")
      .to('[data-animate="hero-p"]', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
      .to('[data-animate="scroll-indicator"]', { opacity: 1, duration: 1, ease: 'power1.inOut' });
}

export function enableHeroTextParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || heroTextParallaxHandler) return;
    const textWrapper = document.getElementById('hero-text-wrapper');
    if (!textWrapper) return;

    let tx = 0, ty = 0, vx = 0, vy = 0;
    const speed = 0.08;

    function frame() {
        vx += (tx - vx) * speed;
        vy += (ty - vy) * speed;
        textWrapper.style.transform = `translate3d(${vx}px, ${vy}px, 0)`;
        heroTextParallaxHandler.raf = requestAnimationFrame(frame);
    }

    function onMove(e) {
        const rect = textWrapper.parentElement.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        tx = -dx * 40; 
        ty = -dy * 30;
    }

    heroTextParallaxHandler = { onMove, raf: null };
    window.addEventListener('mousemove', onMove);
    frame();
}

export function disableHeroTextParallax() {
    if (!heroTextParallaxHandler) return;
    window.removeEventListener('mousemove', heroTextParallaxHandler.onMove);
    cancelAnimationFrame(heroTextParallaxHandler.raf);
    heroTextParallaxHandler = null;
    const textWrapper = document.getElementById('hero-text-wrapper');
    if (textWrapper) textWrapper.style.transform = '';
}

export function initScrollAnimations(sphere, camera) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !sphere || !camera || typeof gsap === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    scrollTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#main-content-wrapper",
            start: "top bottom", 
            end: "top top", 
            scrub: 0.5, 
        }
    });
    
    const xPosition = window.innerWidth > 768 ? 18 : 9;
    scrollTimeline.to(sphere.position, {
        x: xPosition, 
        y: -5,
        ease: "power1.inOut"
    }, 0);

    scrollTimeline.to(sphere.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        ease: "power1.inOut"
    }, 0);
}

export function killScrollAnimations() {
    if (scrollTimeline) {
        scrollTimeline.kill();
        scrollTimeline = null;
    }
}

export function initializeHomePageAnimations() {
    const heroImageContainer = document.getElementById('hero-image-container');
    if (heroImageContainer) {
        const { sphere, camera } = initHeroImage(heroImageContainer);
        initScrollAnimations(sphere, camera);
    }
    enableHeroTextParallax();
    animateHeroText();
}

export function cleanupPageAnimations() {
    cleanupHeroImage();
    disableHeroTextParallax();
    killScrollAnimations();
}

// Helper function to split titles into words and letters for animation
function splitTitleForAnimation(title) {
    if (!title.querySelector('span.letter')) {
        const words = title.textContent.trim().split(' ');
        title.innerHTML = words.map(word => {
            const letters = word.split('').map(letter => `<span class='letter' style='display: inline-block;'>${letter}</span>`).join('');
            // Wrap each word in a span to prevent awkward line breaks
            return `<span class="word" style="display: inline-block;">${letters}</span>`;
        }).join(' ');
    }
}


export function initInteractiveCards() {
    // --- Home Page Feature Card Animations (Anime.js) ---
    const featureCards = document.querySelectorAll('.home-feature-card-a, .home-feature-card-b, .home-feature-card-c');
    if (featureCards.length > 0 && typeof anime !== 'undefined') {
        featureCards.forEach(card => {
            const title = card.querySelector('.card-title');
            if (!title) return;

            splitTitleForAnimation(title);

            let isAnimating = false;

            card.addEventListener('mouseenter', () => {
                if (isAnimating) return;
                isAnimating = true;

                anime({
                    targets: title,
                    translateY: [
                        { value: card.classList.contains('home-feature-card-b') ? -40 : (card.classList.contains('home-feature-card-c') ? -100 : -70), duration: 400, easing: 'easeOutExpo' }
                    ],
                });

                anime({
                    targets: title.querySelectorAll('.letter'),
                    translateY: [
                        { value: -5, duration: 150, easing: 'easeOutSine' },
                        { value: 0, duration: 450, easing: 'spring(1, 80, 10, 0)' }
                    ],
                    delay: anime.stagger(30),
                    complete: () => {
                        isAnimating = false;
                    }
                });
            });

            card.addEventListener('mouseleave', () => {
                if (isAnimating) {
                    anime.remove(title);
                    anime.remove(title.querySelectorAll('.letter'));
                }
                isAnimating = false;
                anime({
                    targets: title,
                    translateY: 0,
                    duration: 400,
                    easing: 'easeOutExpo'
                });
                anime({
                    targets: title.querySelectorAll('.letter'),
                    translateY: 0,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
        });
    }

    // --- Projects Page Card Animations (Anime.js) ---
    const projectCards = document.querySelectorAll('#projects-grid .gradient-border-card');
    if (projectCards.length > 0 && typeof anime !== 'undefined') {
        projectCards.forEach(card => {
            const title = card.querySelector('h3');
            if (!title) return;

            splitTitleForAnimation(title);

            let titleAnimation;

            card.addEventListener('mouseenter', () => {
                if (titleAnimation) titleAnimation.pause();

                titleAnimation = anime({
                    targets: title.querySelectorAll('.letter'),
                    translateY: [
                        { value: [0, -8], duration: 200, easing: 'easeOutSine' },
                        { value: 0, duration: 600, easing: 'spring(1, 80, 15, 0)' }
                    ],
                    rotateZ: [
                        { value: [0, -5], duration: 200, easing: 'easeOutSine' },
                        { value: 0, duration: 600, easing: 'spring(1, 80, 15, 0)' }
                    ],
                    delay: anime.stagger(35)
                });

                anime.remove(card);
                anime({
                    targets: card,
                    scale: 1.05,
                    translateY: -8,
                    easing: 'spring(1, 80, 10, 0)'
                });
            });

            card.addEventListener('mouseleave', () => {
                if (titleAnimation) titleAnimation.pause();
                
                anime({
                    targets: title.querySelectorAll('.letter'),
                    translateY: 0,
                    rotateZ: 0,
                    duration: 300,
                    easing: 'easeOutQuad'
                });

                anime.remove(card);
                anime({
                    targets: card,
                    scale: 1,
                    translateY: 0,
                    easing: 'spring(1, 80, 10, 0)'
                });
            });
        });
    }

    // --- About Me Section Title Animation ---
    const aboutSection = document.querySelector('.about-me-section');
    if (aboutSection && typeof anime !== 'undefined') {
        const title = aboutSection.querySelector('h2');
        if (!title) return;

        splitTitleForAnimation(title);
        let aboutTitleAnimation;

        aboutSection.addEventListener('mouseenter', () => {
            if (aboutTitleAnimation) aboutTitleAnimation.pause();

            aboutTitleAnimation = anime({
                targets: title.querySelectorAll('.letter'),
                translateY: [
                    { value: [0, -8], duration: 200, easing: 'easeOutSine' },
                    { value: 0, duration: 600, easing: 'spring(1, 80, 15, 0)' }
                ],
                rotateZ: [
                    { value: [0, -5], duration: 200, easing: 'easeOutSine' },
                    { value: 0, duration: 600, easing: 'spring(1, 80, 15, 0)' }
                ],
                delay: anime.stagger(35)
            });
        });

        aboutSection.addEventListener('mouseleave', () => {
            if (aboutTitleAnimation) aboutTitleAnimation.pause();

            anime({
                targets: title.querySelectorAll('.letter'),
                translateY: 0,
                rotateZ: 0,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    }
}

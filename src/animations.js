/**
 * @file animations.js
 * @description Manages all animations for the portfolio website.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let heroTextParallaxHandler = null;
let heroSceneApi = null;
let heroResolveTween = null;

// Helper function to split titles for animation
function splitTitleForAnimation(title) {
    if (!title.querySelector('span.letter')) {
        const words = title.textContent.trim().split(' ');
        title.innerHTML = words.map(word => {
            const letters = word.split('').map(letter => `<span class='letter' style='display: inline-block;'>${letter}</span>`).join('');
            return `<span class="word" style="display: inline-block;">${letters}</span>`;
        }).join(' ');
    }
}

// Function to handle scroll-to-zoom on the homepage image gallery
function initImageScrollZoom() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const target = document.getElementById('flipping-image-wrapper');
    if (!target) return;

    gsap.to(target, {
        scrollTrigger: {
            trigger: target,
            start: "top center+=100",
            end: "bottom top",
            scrub: 1.2,
        },
        scale: 1.25,
        ease: "power1.inOut"
    });
}

export function initWorkexPageAnimations() {
    // The timeline entries are revealed by the shared ScrollTrigger pass in
    // initGsapScrollTriggers, so there is nothing route-specific left to set up.
}

export function animateHeroText() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.set('[data-animate]', { y: 20, opacity: 0 });
    const tl = gsap.timeline();
    // Kept short and front-loaded: the hero paragraph is the LCP candidate on this
    // page, so it can't sit at opacity 0 for long or it blows the LCP budget.
    tl.to('[data-animate="hero-title"]', { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' })
      .to('[data-animate="hero-subtitle"]', { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, "-=0.25")
      .to('[data-animate="hero-p"]', { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, "-=0.25")
      .to('[data-animate="scroll-indicator"]', { opacity: 1, duration: 0.5, ease: 'power1.inOut' }, "-=0.1");
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

// OPTIMIZATION: New function using GSAP ScrollTrigger for robust scroll animations
export function initGsapScrollTriggers() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Animate .scroll-fade elements
    gsap.utils.toArray('.scroll-fade').forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, 
                y: 0,
                duration: 0.6,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Animate .scroll-reveal elements
    gsap.utils.toArray('.scroll-reveal').forEach(el => {
        gsap.fromTo(el, 
            { clipPath: 'inset(100% 0% 0% 0%)', y: 50 },
            { 
                clipPath: 'inset(0% 0% 0% 0%)', 
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
}

// Mounts the Three.js particle hero (dynamic import, home route only) and eases
// it from noise to its resolved "VA" shape once fonts + the scene are actually ready.
// Guarded with a generation token: if the user navigates away (and disposeHomeHeroScene
// runs) before this resolves, stale awaits below must not touch the torn-down scene.
let mountToken = 0;

async function mountHeroScene() {
    const token = ++mountToken;
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    let mod;
    try {
        mod = await import('./three-scene.js');
    } catch {
        return; // network/parse failure - static SVG gradient fallback stays visible
    }
    if (token !== mountToken) return; // superseded while importing

    if (!mod.isHeroSceneSupported()) return; // no WebGL - static SVG gradient fallback stays visible

    // Yield to the browser before the heavy synchronous work (particle buffers,
    // shader compile) so the hero text's own paint/reveal isn't blocked behind it.
    await new Promise((resolve) => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(resolve, { timeout: 500 });
        } else {
            requestAnimationFrame(() => requestAnimationFrame(resolve));
        }
    });
    if (token !== mountToken) return; // superseded while idle

    heroSceneApi = mod.initHeroScene(canvas);
    if (!heroSceneApi) return;
    const api = heroSceneApi; // stable per-mount reference for the closures below

    canvas.classList.add('is-active');
    document.querySelector('.abstract-svg-1')?.classList.add('is-hidden');

    await Promise.all([api.ready, document.fonts ? document.fonts.ready : Promise.resolve()]);
    if (token !== mountToken) return; // superseded while waiting for ready

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const state = { p: 0 };
        heroResolveTween = gsap.to(state, {
            p: 1,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => api.setProgress(state.p),
        });
    }
}

export function initHomeHeroScene() {
    mountHeroScene();
}

function disposeHomeHeroScene() {
    if (heroResolveTween) {
        heroResolveTween.kill();
        heroResolveTween = null;
    }
    if (!heroSceneApi) return;
    heroSceneApi = null;
    import('./three-scene.js').then((mod) => mod.disposeHeroScene());
}

export function initializeHomePageAnimations() {
    enableHeroTextParallax();
    animateHeroText();
    initImageScrollZoom();
}

export function cleanupPageAnimations() {
    disableHeroTextParallax();
    disposeHomeHeroScene();
    // Kill all ScrollTrigger instances to prevent memory leaks between page loads
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}

export function initInteractiveCards() {
    const featureCards = document.querySelectorAll('.home-feature-card');
    if (featureCards.length > 0 && window.innerWidth > 768) {
        featureCards.forEach(card => {
            const title = card.querySelector('.card-title');
            if (!title) return;

            splitTitleForAnimation(title);
            const letters = title.querySelectorAll('.letter');
            // Lift the title by exactly as much as the details panel is about to
            // occupy, so cards with different copy lengths all land correctly.
            const details = card.querySelector('.card-details');
            const liftDistance = details ? -Math.min(150, details.scrollHeight) : -70;

            card.addEventListener('mouseenter', () => {
                gsap.killTweensOf([title, letters]);
                gsap.to(title, { y: liftDistance, duration: 0.4, ease: 'expo.out' });
                gsap.to(letters, {
                    keyframes: [
                        { y: -5, duration: 0.15, ease: 'sine.out' },
                        { y: 0, duration: 0.45, ease: 'elastic.out(1, 0.5)' }
                    ],
                    stagger: 0.03
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.killTweensOf([title, letters]);
                gsap.to(title, { y: 0, duration: 0.4, ease: 'expo.out' });
                gsap.to(letters, { y: 0, duration: 0.2, ease: 'power1.out' });
            });
        });
    }

    const projectCards = document.querySelectorAll('#projects-grid .gradient-border-card');
    if (projectCards.length > 0) {
        projectCards.forEach(card => {
            const title = card.querySelector('h3');
            if (!title) return;

            splitTitleForAnimation(title);
            const letters = title.querySelectorAll('.letter');

            card.addEventListener('mouseenter', () => {
                gsap.killTweensOf([card, letters]);
                gsap.to(letters, {
                    keyframes: [
                        { y: -8, rotateZ: -5, duration: 0.2, ease: 'sine.out' },
                        { y: 0, rotateZ: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }
                    ],
                    stagger: 0.015
                });
                gsap.to(card, { scale: 1.05, y: -8, duration: 0.5, ease: 'elastic.out(1, 0.6)' });
            });

            card.addEventListener('mouseleave', () => {
                gsap.killTweensOf([card, letters]);
                gsap.to(letters, { y: 0, rotateZ: 0, duration: 0.3, ease: 'power1.out' });
                gsap.to(card, { scale: 1, y: 0, duration: 0.4, ease: 'power2.out' });
            });
        });
    }

    const aboutSection = document.querySelector('.about-me-section');
    if (aboutSection) {
        const title = aboutSection.querySelector('h2');
        if (!title) return;

        splitTitleForAnimation(title);
        const letters = title.querySelectorAll('.letter');

        aboutSection.addEventListener('mouseenter', () => {
            gsap.killTweensOf(letters);
            gsap.to(letters, {
                keyframes: [
                    { y: -8, rotateZ: -5, duration: 0.2, ease: 'sine.out' },
                    { y: 0, rotateZ: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }
                ],
                stagger: 0.035
            });
        });

        aboutSection.addEventListener('mouseleave', () => {
            gsap.killTweensOf(letters);
            gsap.to(letters, { y: 0, rotateZ: 0, duration: 0.3, ease: 'power1.out' });
        });
    }
}

export function initWorkexDetailAnimations() {
    const sections = document.querySelectorAll('.workex-v-section');
    const navLinks = document.querySelectorAll('.workex-v-nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const navLink = document.querySelector(`.workex-v-nav-link[href="#${id}"]`);

                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) {
                        navLink.classList.add('active');
                    }
                }
            });
        }, { rootMargin: "-30% 0px -70% 0px", threshold: 0 });

        sections.forEach(section => { observer.observe(section); });

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });
    }

    const mediaContainer = document.querySelector('.workex-v-media-container');
    if (mediaContainer) {
        gsap.to(mediaContainer, {
            scrollTrigger: {
                trigger: '.workex-v-body',
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
            },
            scale: 1.15,
        });
    }

    // One media block per detail page: the intro video fades out on end and the
    // company logo fades in behind it.
    const media = document.querySelector('.workex-v-media-container');
    const video = media?.querySelector('.workex-v-video');
    const logo = media?.querySelector('.workex-v-logo');

    if (video && logo) {
        video.onended = () => {
            gsap.to(video, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    video.style.display = 'none';
                    logo.classList.remove('hidden');
                    gsap.fromTo(logo, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 });
                }
            });
        };
    }
}

export function initProjectFilters() {
    const filterContainer = document.querySelector('.project-filters');
    const grid = document.getElementById('projects-grid');
    if (!filterContainer || !grid) return;

    filterContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.filter-pill');
        if (!pill || pill.classList.contains('active')) return;

        filterContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.dataset.filter;
        const cards = Array.from(grid.querySelectorAll('.gradient-border-card'));
        const toHide = cards.filter(card => filter !== 'all' && card.dataset.category !== filter);
        const toShow = cards.filter(card => filter === 'all' || card.dataset.category === filter);

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            toShow.forEach(card => card.classList.remove('is-filtered-out'));
            toHide.forEach(card => card.classList.add('is-filtered-out'));
            return;
        }

        gsap.killTweensOf(cards);
        if (toHide.length) {
            gsap.to(toHide, {
                opacity: 0,
                scale: 0.95,
                duration: 0.2,
                ease: 'power1.out',
                onComplete: () => toHide.forEach(card => card.classList.add('is-filtered-out'))
            });
        }
        toShow.forEach(card => card.classList.remove('is-filtered-out'));
        gsap.fromTo(toShow,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out', stagger: 0.03, delay: toHide.length ? 0.15 : 0 }
        );
    });
}
/**
 * @file 3d-background.js
 * @description Handles the Three.js interactive particle background animation.
 * Includes performance optimizations for mobile and page visibility.
 */

// Ensure THREE is loaded
if (typeof THREE === 'undefined') {
    console.error('Three.js has not been loaded. Make sure to include it before this script.');
}

// Store animation state
let animationFrameId;
let isTabVisible = true;

/**
 * Cleans up the Three.js scene, renderer, and event listeners.
 * This is good practice for SPAs to prevent memory leaks.
 */
export function cleanupThreeJS() {
    window.cancelAnimationFrame(animationFrameId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    // In a real SPA, you would also dispose of geometries, materials, etc.
    console.log("Three.js scene cleaned up.");
}

/**
 * Pauses animation when the tab is not visible.
 */
function handleVisibilityChange() {
    isTabVisible = !document.hidden;
}

export function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) {
        console.error('Canvas element #bg-canvas not found.');
        return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true, // Transparent background
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Performance check: reduce particles on smaller screens
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 1500 : 4000;

    // Particle Geometry
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle Material - adjusted for better visibility
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: '#005f73', // Using the darker primary color for better contrast
        transparent: true,
        opacity: 0.7, // Increased opacity for better visibility
        blending: THREE.AdditiveBlending
    });

    // Create the points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Camera position
    camera.position.z = 5;

    // Mouse tracking
    const mouse = new THREE.Vector2();
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Page Visibility API for performance
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
        // Pause animation if tab is not active
        if (!isTabVisible) {
            animationFrameId = window.requestAnimationFrame(animate);
            return;
        }

        const elapsedTime = clock.getElapsedTime();

        // Animate particles
        particles.rotation.y = elapsedTime * 0.05;
        particles.rotation.x = elapsedTime * 0.02;

        // Make particles react to mouse
        camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        // Render the scene
        renderer.render(scene, camera);

        // Call the loop again on the next frame
        animationFrameId = window.requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
}
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // If reduced motion is preferred, ensure content is visible without animation
    document.querySelectorAll('[data-animate]').forEach(el => el.style.opacity = 1);
}
/**
 * @file three-scene.js
 * @description Hero signature piece: a THREE.Points field that eases from noisy
 * random positions into a resolved "VA" silhouette, driven by uProgress.
 * Only ever imported dynamically, and only on the home route.
 */

import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    BufferGeometry,
    BufferAttribute,
    ShaderMaterial,
    Points,
    Color,
    Clock,
    AdditiveBlending,
} from 'three';

const PARTICLE_TEXT = 'VA';

let scene = null;
let camera = null;
let renderer = null;
let points = null;
let material = null;
let clock = null;
let rafId = null;
let resizeHandler = null;
let pointerHandler = null;
let running = false;

let targetRotation = { x: 0, y: 0 };
let currentRotation = { x: 0, y: 0 };

const vertexShader = `
    attribute vec3 aStartPosition;
    attribute vec3 aTargetPosition;
    uniform float uProgress;
    uniform float uTime;
    varying float vAlpha;

    float easeOutCubic(float t) {
        return 1.0 - pow(1.0 - t, 3.0);
    }

    void main() {
        float eased = easeOutCubic(clamp(uProgress, 0.0, 1.0));
        vec3 pos = mix(aStartPosition, aTargetPosition, eased);

        float drift = 1.0 - eased;
        pos.x += sin(uTime * 0.3 + aStartPosition.y * 2.0) * 0.04 * drift;
        pos.y += cos(uTime * 0.25 + aStartPosition.x * 2.0) * 0.04 * drift;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = (0.8 + eased * 0.8) * (18.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        vAlpha = 0.25 + eased * 0.45;
    }
`;

const fragmentShader = `
    precision mediump float;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying float vAlpha;

    void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float dist = length(uv);
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.05, dist) * vAlpha;
        vec3 color = mix(uColorA, uColorB, clamp(dist * 2.0, 0.0, 1.0));
        gl_FragColor = vec4(color, alpha);
    }
`;

export function isHeroSceneSupported() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
    } catch {
        return false;
    }
}

function getParticleCount() {
    const isMobile = window.innerWidth < 768;
    const lowPower = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
    if (isMobile) return lowPower ? 3000 : 5000;
    return lowPower ? 8000 : 15000;
}

// Sample points from a canvas-rendered text mask so particles resolve into a legible "VA" silhouette.
function sampleTextPositions(text, count) {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${size * 0.5}px 'Playfair Display', Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, size / 2, size / 2);

    const { data } = ctx.getImageData(0, 0, size, size);
    const candidates = [];
    for (let y = 0; y < size; y += 2) {
        for (let x = 0; x < size; x += 2) {
            if (data[(y * size + x) * 4 + 3] > 128) {
                candidates.push({
                    x: (x / size - 0.5) * 9,
                    y: -(y / size - 0.5) * 9,
                });
            }
        }
    }

    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const p = candidates.length ? candidates[(Math.random() * candidates.length) | 0] : { x: 0, y: 0 };
        positions[i * 3] = p.x + (Math.random() - 0.5) * 0.06;
        positions[i * 3 + 1] = p.y + (Math.random() - 0.5) * 0.06;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }
    return positions;
}

function sampleNoisePositions(count) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const radius = 4.5 + Math.random() * 2.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
}

/**
 * Mounts the scene onto an existing <canvas>. Returns null if WebGL init fails
 * for any reason (context loss, driver issue) so the caller can fall back cleanly.
 */
export function initHeroScene(canvas) {
    if (!canvas || !isHeroSceneSupported()) return null;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = getParticleCount();

    try {
        scene = new Scene();
        camera = new PerspectiveCamera(50, canvas.clientWidth / Math.max(canvas.clientHeight, 1), 0.1, 100);
        camera.position.z = 6.5;

        renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    } catch {
        return null;
    }

    const startPositions = sampleNoisePositions(count);
    const targetPositions = sampleTextPositions(PARTICLE_TEXT, count);

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(startPositions.slice(), 3));
    geometry.setAttribute('aStartPosition', new BufferAttribute(startPositions, 3));
    geometry.setAttribute('aTargetPosition', new BufferAttribute(targetPositions, 3));

    material = new ShaderMaterial({
        uniforms: {
            uProgress: { value: prefersReducedMotion ? 1 : 0 },
            uTime: { value: 0 },
            uColorA: { value: new Color('#0a9396') },
            uColorB: { value: new Color('#005f73') },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
    });

    points = new Points(geometry, material);
    scene.add(points);

    resizeHandler = () => {
        if (!renderer || !camera) return;
        const width = canvas.clientWidth;
        const height = Math.max(canvas.clientHeight, 1);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
    };
    window.addEventListener('resize', resizeHandler);

    if (!prefersReducedMotion) {
        pointerHandler = (e) => {
            targetRotation.y = ((e.clientX / window.innerWidth) - 0.5) * 0.35;
            targetRotation.x = ((e.clientY / window.innerHeight) - 0.5) * 0.18;
        };
        window.addEventListener('mousemove', pointerHandler);
    }

    running = true;
    clock = new Clock();

    let resolveReady;
    const ready = new Promise((resolve) => { resolveReady = resolve; });

    function animate() {
        if (!running) return;
        rafId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();
        material.uniforms.uTime.value = elapsed;

        if (!prefersReducedMotion) {
            currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
            currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
            points.rotation.x = currentRotation.x;
            points.rotation.y = currentRotation.y + elapsed * 0.04;
        }

        renderer.render(scene, camera);
        if (resolveReady) {
            resolveReady();
            resolveReady = null;
        }
    }
    animate();

    return {
        ready,
        setProgress(value) {
            if (!material || prefersReducedMotion) return;
            material.uniforms.uProgress.value = Math.max(0, Math.min(1, value));
        },
    };
}

export function disposeHeroScene() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;

    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    if (pointerHandler) window.removeEventListener('mousemove', pointerHandler);
    resizeHandler = null;
    pointerHandler = null;

    if (points) {
        points.geometry.dispose();
        points.material.dispose();
        scene?.remove(points);
    }
    renderer?.dispose();

    scene = null;
    camera = null;
    renderer = null;
    points = null;
    material = null;
    clock = null;
    targetRotation = { x: 0, y: 0 };
    currentRotation = { x: 0, y: 0 };
}

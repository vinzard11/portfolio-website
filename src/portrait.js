/**
 * @file portrait.js
 * @description The home-page halftone portrait, drawn on a canvas.
 *
 * - Two portraits share one square grid of halftone cells. Every few seconds the
 *   dots morph from one to the other, sweeping down the frame like a scanner.
 * - Under the cursor, a soft-edged lens shows the real photo through the dots.
 *
 * The static halftone <img> in the markup is the fallback: it stays visible until
 * the canvas is ready, and remains for crawlers and visitors without JavaScript.
 */

const G = 200;                 // halftone cells across and down (must match build-portraits)
const INK = '#1f2523';
const HOLD_MS = 6500;          // time each portrait stays up
const MORPH_MS = 1600;         // length of the dot sweep

const smooth = (t) => t * t * (3 - 2 * t);
const clamp01 = (t) => Math.min(1, Math.max(0, t));

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`portrait: could not load ${src}`));
        img.src = src;
    });
}

/** Reads an ink map (one grayscale pixel per cell) into dot amounts from 0 to 1. */
async function loadInk(src) {
    const img = await loadImage(src);
    const c = document.createElement('canvas');
    c.width = G; c.height = G;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, G, G);
    const px = ctx.getImageData(0, 0, G, G).data;
    const out = new Float32Array(G * G);
    for (let i = 0; i < out.length; i++) out[i] = px[i * 4] / 255;
    return out;
}

export function initPortrait(root, onDispose) {
    const fig = root.querySelector('[data-portrait]');
    if (!fig) return;
    const sources = JSON.parse(fig.dataset.portrait);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let disposed = false;
    onDispose(() => { disposed = true; });

    Promise.all(sources.map(async (s) => ({ ink: await loadInk(s.ink), photo: await loadImage(s.photo) })))
        .then((portraits) => { if (!disposed) start(portraits); })
        .catch(() => { /* keep the static image */ });

    function start(portraits) {
        const canvas = document.createElement('canvas');
        canvas.className = 'portrait-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        fig.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        // Offscreen layers: the settled halftone, and the lens contents.
        const base = document.createElement('canvas');
        const lens = document.createElement('canvas');
        const bctx = base.getContext('2d');
        const lctx = lens.getContext('2d');

        // Per-cell jitter so the sweep edge reads as grain, not a ruler line.
        const jitter = new Float32Array(G * G);
        for (let i = 0; i < jitter.length; i++) jitter[i] = Math.random();

        let W = 0, H = 0, dpr = 1;
        let cur = 0, next = 1;
        let morphStart = 0, morphing = false;
        let raf = 0, timer = 0;
        const pointer = { x: 0, y: 0, tx: 0, ty: 0, r: 0, tr: 0 };

        function drawDots(target, a, b, t) {
            target.clearRect(0, 0, W, H);
            target.fillStyle = INK;
            target.beginPath();
            const cell = W / G;
            const rmax = cell * 0.6;
            for (let y = 0; y < G; y++) {
                const row = y / G;
                for (let x = 0; x < G; x++) {
                    const i = y * G + x;
                    let v = a[i];
                    if (b) {
                        // Rows further down start later; jitter roughens the edge.
                        const local = smooth(clamp01(t * 1.7 - row * 0.55 - jitter[i] * 0.15));
                        v = a[i] + (b[i] - a[i]) * local;
                    }
                    if (v < 0.03) continue;
                    const r = rmax * Math.sqrt(v);
                    const cx = (x + 0.5) * cell, cy = (y + 0.5) * cell;
                    target.moveTo(cx + r, cy);
                    target.arc(cx, cy, r, 0, Math.PI * 2);
                }
            }
            target.fill();
        }

        function resize() {
            const rect = fig.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = Math.round(rect.width * dpr);
            H = Math.round(rect.height * dpr);
            for (const c of [canvas, base, lens]) { c.width = W; c.height = H; }
            drawDots(bctx, portraits[cur].ink, null, 0);
            frame();
        }

        function frame() {
            raf = 0;
            const now = performance.now();
            let settled = true;

            // 1. Dots: either the settled base, or a morph in progress.
            if (morphing) {
                const t = clamp01((now - morphStart) / MORPH_MS);
                drawDots(ctx, portraits[cur].ink, portraits[next].ink, t);
                if (t >= 1) {
                    morphing = false;
                    cur = next;
                    next = (cur + 1) % portraits.length;
                    drawDots(bctx, portraits[cur].ink, null, 0);
                    schedule();
                } else settled = false;
            } else {
                ctx.clearRect(0, 0, W, H);
                ctx.drawImage(base, 0, 0);
            }

            // 2. Lens: ease position and radius, then paint the real photo through it.
            pointer.x += (pointer.tx - pointer.x) * 0.22;
            pointer.y += (pointer.ty - pointer.y) * 0.22;
            pointer.r += (pointer.tr - pointer.r) * 0.18;
            if (Math.abs(pointer.tx - pointer.x) > 0.3 || Math.abs(pointer.ty - pointer.y) > 0.3 || Math.abs(pointer.tr - pointer.r) > 0.3) settled = false;
            if (pointer.r > 0.5) {
                const showing = morphing && (now - morphStart) / MORPH_MS > 0.5 ? next : cur;
                lctx.globalCompositeOperation = 'source-over';
                lctx.clearRect(0, 0, W, H);
                lctx.drawImage(portraits[showing].photo, 0, 0, W, H);
                lctx.globalCompositeOperation = 'destination-in';
                const g = lctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, pointer.r);
                g.addColorStop(0, 'rgba(0,0,0,1)');
                g.addColorStop(0.62, 'rgba(0,0,0,1)');
                g.addColorStop(1, 'rgba(0,0,0,0)');
                lctx.fillStyle = g;
                lctx.fillRect(0, 0, W, H);
                ctx.drawImage(lens, 0, 0);
            }

            if (!settled) raf = requestAnimationFrame(frame);
        }

        const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

        // Cycling: only while the portrait is on screen and the tab is visible.
        let onScreen = true;
        function schedule() {
            clearTimeout(timer);
            if (reduceMotion || portraits.length < 2) return;
            timer = setTimeout(() => {
                if (disposed) return;
                if (!onScreen || document.hidden) return schedule();
                morphing = true;
                morphStart = performance.now();
                kick();
            }, HOLD_MS);
        }

        const io = new IntersectionObserver(([en]) => { onScreen = en.isIntersecting; });
        io.observe(fig);

        const toLocal = (e) => {
            const rect = canvas.getBoundingClientRect();
            return { x: (e.clientX - rect.left) * dpr, y: (e.clientY - rect.top) * dpr };
        };
        const onMove = (e) => {
            if (e.pointerType !== 'mouse') return;
            const p = toLocal(e);
            if (pointer.tr === 0) { pointer.x = p.x; pointer.y = p.y; }
            pointer.tx = p.x; pointer.ty = p.y;
            pointer.tr = Math.min(W, H) * 0.16;
            kick();
        };
        const onLeave = () => { pointer.tr = 0; kick(); };

        if (canHover) {
            fig.addEventListener('pointermove', onMove);
            fig.addEventListener('pointerleave', onLeave);
        }
        const ro = new ResizeObserver(resize);
        ro.observe(fig);

        fig.classList.add('is-live');
        resize();
        schedule();

        onDispose(() => {
            cancelAnimationFrame(raf);
            clearTimeout(timer);
            io.disconnect();
            ro.disconnect();
            fig.removeEventListener('pointermove', onMove);
            fig.removeEventListener('pointerleave', onLeave);
        });
    }
}

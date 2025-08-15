/**
 * @file hero-image.js
 * @description Renders a fluid, interactive sphere inspired by itsoffbrand.com.
 * Features a mercury-like mouse distortion, iridescent procedural coloring, and a
 * localized glitch effect on hover, all achieved with a custom GLSL shader.
 */

// Ensure THREE is loaded.
if (typeof THREE === 'undefined') {
    console.error('Three.js is not loaded.');
}

// Module-level state to manage the animation
let state = null;

/**
 * Initializes the 3D hero image animation.
 * @param {HTMLElement} container - The container element for the canvas.
 * @returns {object} An object containing the sphere and camera for external control.
 */
export function initHeroImage(container) {
    if (!container || state) return; // Do not re-initialize

    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- Core Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(37, width / height, 0.1, 100);
    camera.position.set(0, 0, 30); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // --- Jelly Sphere Model ---
    // **NEW:** Make sphere size responsive.
    const isMobile = window.innerWidth <= 768;
    const sphereSize = isMobile ? 3.5 : 5;
    const geometry = new THREE.IcosahedronGeometry(sphereSize, 64);

    // The ShaderMaterial is where all the magic happens.
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uMouse3D: { value: new THREE.Vector3() },
            uHover: { value: 0.0 },
            uColor1: { value: new THREE.Color("#F2AB38") },
            uColor2: { value: new THREE.Color("#50DEAC") },
            uColor3: { value: new THREE.Color("#50D9DE") },
            uColor4: { value: new THREE.Color("#E655AC") },
        },
        vertexShader: `
            uniform vec3 uMouse3D;
            uniform float uTime;
            uniform float uHover;

            varying vec3 vPosition;
            varying vec3 vNormal;
            varying float vNoise;
            varying vec3 vViewDirection;

            // Classic Perlin 3D Noise
            vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
            vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
            float snoise(vec3 v){
              const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
              const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
              vec3 i  = floor(v + dot(v, C.yyy) );
              vec3 x0 =   v - i + dot(i, C.xxx) ;
              vec3 g = step(x0.yzx, x0.xyz);
              vec3 l = 1.0 - g;
              vec3 i1 = min( g.xyz, l.zxy );
              vec3 i2 = max( g.xyz, l.zxy );
              vec3 x1 = x0 - i1 + C.xxx;
              vec3 x2 = x0 - i2 + C.yyy;
              vec3 x3 = x0 - D.yyy;
              i = mod(i, 289.0);
              vec4 p = permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 );
              float n_ = 0.142857142857;
              vec3  ns = n_ * D.wyz - D.xzx;
              vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
              vec4 x_ = floor(j * ns.z);
              vec4 y_ = floor(j - 7.0 * x_);
              vec4 x = x_ *ns.x + ns.yyyy;
              vec4 y = y_ *ns.x + ns.yyyy;
              vec4 h = 1.0 - abs(x) - abs(y);
              vec4 b0 = vec4( x.xy, y.xy );
              vec4 b1 = vec4( x.zw, y.zw );
              vec4 s0 = floor(b0)*2.0 + 1.0;
              vec4 s1 = floor(b1)*2.0 + 1.0;
              vec4 sh = -step(h, vec4(0.0));
              vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
              vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
              vec3 p0 = vec3(a0.xy,h.x);
              vec3 p1 = vec3(a0.zw,h.y);
              vec3 p2 = vec3(a1.xy,h.z);
              vec3 p3 = vec3(a1.zw,h.w);
              vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
              p0 *= norm.x;
              p1 *= norm.y;
              p2 *= norm.z;
              p3 *= norm.w;
              vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
              m = m * m;
              return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
            }

            void main() {
                vNormal = normal;
                vPosition = position;
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vViewDirection = normalize(cameraPosition - worldPosition.xyz);

                // --- Mercury Distortion Effect ---
                vec3 mousePos3D = uMouse3D;
                float mouseDistance = distance(position, mousePos3D);
                float stretchFactor = 1.0 - smoothstep(0.0, 6.0, mouseDistance);
                vec3 direction = normalize(position - mousePos3D);
                vec3 displacedPosition = position + direction * stretchFactor * uHover * 2.0;

                float noise = snoise(position * 1.0 + uTime * 0.1); 
                displacedPosition += normal * noise * 0.1; 
                vNoise = noise;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform float uHover;
            uniform vec2 uMouse;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform vec3 uColor3;
            uniform vec3 uColor4;

            varying vec3 vPosition;
            varying vec3 vNormal;
            varying float vNoise;
            varying vec3 vViewDirection;

            // Classic Perlin 3D Noise function (copied from vertex shader for use here)
            vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
            vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
            float snoise(vec3 v){
              const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
              const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
              vec3 i  = floor(v + dot(v, C.yyy) );
              vec3 x0 =   v - i + dot(i, C.xxx) ;
              vec3 g = step(x0.yzx, x0.xyz);
              vec3 l = 1.0 - g;
              vec3 i1 = min( g.xyz, l.zxy );
              vec3 i2 = max( g.xyz, l.zxy );
              vec3 x1 = x0 - i1 + C.xxx;
              vec3 x2 = x0 - i2 + C.yyy;
              vec3 x3 = x0 - D.yyy;
              i = mod(i, 289.0);
              vec4 p = permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 );
              float n_ = 0.142857142857;
              vec3  ns = n_ * D.wyz - D.xzx;
              vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
              vec4 x_ = floor(j * ns.z);
              vec4 y_ = floor(j - 7.0 * x_);
              vec4 x = x_ *ns.x + ns.yyyy;
              vec4 y = y_ *ns.x + ns.yyyy;
              vec4 h = 1.0 - abs(x) - abs(y);
              vec4 b0 = vec4( x.xy, y.xy );
              vec4 b1 = vec4( x.zw, y.zw );
              vec4 s0 = floor(b0)*2.0 + 1.0;
              vec4 s1 = floor(b1)*2.0 + 1.0;
              vec4 sh = -step(h, vec4(0.0));
              vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
              vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
              vec3 p0 = vec3(a0.xy,h.x);
              vec3 p1 = vec3(a0.zw,h.y);
              vec3 p2 = vec3(a1.xy,h.z);
              vec3 p3 = vec3(a1.zw,h.w);
              vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
              p0 *= norm.x;
              p1 *= norm.y;
              p2 *= norm.z;
              p3 *= norm.w;
              vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
              m = m * m;
              return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
            }


            void main() {
                // --- Buttery Smooth Color Blending ---
                vec3 seamlessCoords1 = normalize(vPosition);
                vec3 seamlessCoords2 = normalize(vPosition.zxy); 
                vec3 seamlessCoords3 = normalize(vPosition.yzx); 
                
                float noise1 = (snoise(seamlessCoords1 * 1.5 + uTime * 0.05) + 1.0) * 0.5;
                float noise2 = (snoise(seamlessCoords2 * 1.8 + uTime * 0.08) + 1.0) * 0.5;

                vec3 colorA = mix(uColor1, uColor2, noise1);
                vec3 colorB = mix(uColor3, uColor4, noise2);

                float finalMix = (snoise(seamlessCoords3 * 1.2 + uTime * 0.1) + 1.0) * 0.5;
                vec3 baseColor = mix(colorA, colorB, finalMix);

                // "Film on top" effect using Fresnel (rim lighting).
                float fresnel = pow(1.0 - dot(vNormal, vViewDirection), 3.0);
                vec3 finalColor = baseColor + fresnel * 0.5; 

                // Color distortion on hover
                vec3 mousePos3D = vec3(uMouse.x * 11.0, uMouse.y * 11.0, 1.0);
                float mouseDistance = distance(vPosition, mousePos3D);
                float colorDistortion = smoothstep(6.0, 0.0, mouseDistance) * uHover;
                finalColor = mix(finalColor, vec3(1.0), colorDistortion * 0.3); 

                // --- Localized Glitch Effect ---
                if (uHover > 0.01) {
                    if (mouseDistance < 2.0) { 
                        float glitchStrength = smoothstep(2.0, 0.0, mouseDistance);
                        if (fract(uTime * 20.0) > 0.97) {
                            finalColor.rgb = finalColor.gbr;
                        }
                        finalColor += glitchStrength * 0.1;
                    }
                }

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    // --- Interactivity ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const clock = new THREE.Clock();

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener('mousemove', onMouseMove);

    // --- Animation Loop ---
    function animate() {
        state.rafId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        material.uniforms.uTime.value = elapsedTime;

        material.uniforms.uHover.value += (1.0 - material.uniforms.uHover.value) * 0.05;

        raycaster.setFromCamera(mouse, camera);

        const plane = new THREE.Plane();
        const sphereWorldPos = new THREE.Vector3();
        sphere.getWorldPosition(sphereWorldPos); 
        plane.setFromNormalAndCoplanarPoint(
            camera.getWorldDirection(plane.normal), 
            sphereWorldPos 
        );
        
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersectPoint);

        if (intersectPoint) {
            const localMousePos = sphere.worldToLocal(intersectPoint);
            material.uniforms.uMouse3D.value.copy(localMousePos);
        }

        renderer.render(scene, camera);
    }

    // --- Resize Handler ---
    function onResize() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    // --- Start and Cleanup ---
    state = {
        rafId: null,
        cleanup: () => {
            cancelAnimationFrame(state.rafId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            container.removeChild(renderer.domElement);
            geometry.dispose();
            material.dispose();
            state = null;
        }
    };

    animate();
    
    return { sphere, camera };
}

/**
 * Cleans up the hero image animation resources.
 */
export function cleanupHeroImage() {
    if (state && state.cleanup) {
        state.cleanup();
    }
}

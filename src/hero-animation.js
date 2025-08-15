/**
 * @file hero-animation.js
 * @description Manages the hero section WebGL Brand Model animation.
 * This file creates the 3D "V.A." model, its materials, and orbiting particles.
 */

export function initHeroAnimation() {
    const container = document.getElementById('hero-canvas-container');
    if (!container) {
        console.error("Hero canvas container not found.");
        return;
    }

    // --- BASIC SETUP ---
    // Scene, camera, and renderer are the fundamental components of a Three.js application.
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.z = 5; // Position the camera to view the scene.
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Use device's pixel ratio for crisp rendering.
    container.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(); // To track mouse position for interaction.
    const targetRotation = new THREE.Euler(); // To smoothly rotate the model towards the mouse.

    // --- POST-PROCESSING FOR GLOW EFFECT ---
    // EffectComposer is used to apply post-processing effects like bloom.
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.4, 0.85);
    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // --- LIGHTING ---
    // Lighting is crucial for making 3D objects visible and appear realistic.
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Provides soft, even light.
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.8); // Emits light from a single point.
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    const directionalLight = new THREE.DirectionalLight(0x0a9396, 0.5); // Accent color light for highlights.
    directionalLight.position.set(-5, -3, 2);
    scene.add(directionalLight);

    // --- 1. THE "V.A." MODEL ---
    // A group to hold all parts of the model, allowing them to be rotated together.
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const fontLoader = new THREE.FontLoader();
    fontLoader.load('https://cdn.jsdelivr.net/npm/three/examples/fonts/helvetiker_bold.typeface.json', (font) => {
        // Material 1: Technical Architect (Deep Blue-Green Metal)
        const metalMaterial = new THREE.MeshStandardMaterial({
            color: 0x005f73, // Primary color from CSS
            metalness: 0.9,
            roughness: 0.3,
        });

        // Properties for the 3D text geometry.
        const textProps = {
            font: font,
            size: 2,
            height: 0.4,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.02,
            bevelSegments: 5
        };

        // Create 'V' and 'A' geometries from the font.
        const vGeometry = new THREE.TextGeometry('V', textProps);
        const aGeometry = new THREE.TextGeometry('A', textProps);

        vGeometry.center(); // Center the geometry for easier positioning.
        aGeometry.center();

        const vMesh = new THREE.Mesh(vGeometry, metalMaterial);
        const aMesh = new THREE.Mesh(aGeometry, metalMaterial);

        // Position the letters to interlock.
        vMesh.position.x = -1.1;
        aMesh.position.x = 1.1;

        modelGroup.add(vMesh, aMesh);
        
        // Material 2: Business Strategist (Vibrant Glowing Lines)
        const glowMaterial = new THREE.MeshBasicMaterial({ color: 0x0a9396 }); // Accent color from CSS.

        // Create a glowing tube that follows a path along the 'V'.
        const v_path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.7, 1.2, 0),
            new THREE.Vector3(0, -1.2, 0),
            new THREE.Vector3(0.7, 1.2, 0)
        ]);
        const v_tube = new THREE.TubeGeometry(v_path, 64, 0.08, 8, false);
        const v_tubeMesh = new THREE.Mesh(v_tube, glowMaterial);
        vMesh.add(v_tubeMesh); // Add to the letter itself so it moves with it.

        // Create a glowing tube that weaves through the 'A'.
        const a_path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.6, -1.0, 0),
            new THREE.Vector3(-0.3, 0.2, 0.2),  // Weaving effect by changing Z
            new THREE.Vector3(0.3, 0.2, -0.2), // Weaving effect by changing Z
            new THREE.Vector3(0.6, -1.0, 0)
        ]);
        const a_tube = new THREE.TubeGeometry(a_path, 64, 0.08, 8, false);
        const a_tubeMesh = new THREE.Mesh(a_tube, glowMaterial);
        a_tubeMesh.position.y = -0.15; // Adjust vertical position on 'A'.
        aMesh.add(a_tubeMesh);

    });

    // --- 2. ORBITING DATA PARTICLES ---
    const particleCount = 500;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleData = []; // Store custom data for each particle's animation.

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 4 + 2.5; // Random distance from the center.
        const angle = Math.random() * Math.PI * 2;
        
        particlePositions[i3] = radius * Math.cos(angle);
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 10; // Random vertical position.
        particlePositions[i3 + 2] = radius * Math.sin(angle);
        
        // Store data for animation loop.
        particleData.push({
            angle: angle,
            radius: radius,
            speed: (Math.random() - 0.5) * 0.005 // Random speed and direction.
        });
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x0a9396,
        size: 0.05,
        blending: THREE.AdditiveBlending, // Makes particles glow when overlapping.
        transparent: true,
        opacity: 0.7
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);


    // --- EVENT LISTENERS ---
    window.addEventListener('mousemove', (e) => {
        // Normalize mouse coordinates from -0.5 to 0.5.
        mouse.x = (e.clientX / window.innerWidth) - 0.5;
        mouse.y = (e.clientY / window.innerHeight) - 0.5;
    });

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate); // Loop the animation.
        const elapsedTime = clock.getElapsedTime();

        // Update target rotation based on mouse position.
        targetRotation.y = mouse.x * 0.5;
        targetRotation.x = -mouse.y * 0.5;
        
        // Smoothly interpolate model rotation for a fluid effect.
        modelGroup.rotation.y += (targetRotation.y - modelGroup.rotation.y) * 0.05;
        modelGroup.rotation.x += (targetRotation.x - modelGroup.rotation.x) * 0.05;

        // Animate particles in their orbits.
        particles.rotation.y = elapsedTime * 0.1; // Gentle global rotation.
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const data = particleData[i];
            data.angle += data.speed; // Update angle based on individual speed.
            positions[i3] = data.radius * Math.cos(data.angle);
            positions[i3 + 2] = data.radius * Math.sin(data.angle);
        }
        particles.geometry.attributes.position.needsUpdate = true; // Tell Three.js to update the buffer.

        // Render the scene using the composer to apply post-processing.
        composer.render();
    }
    animate();

    // --- RESIZE HANDLER ---
    // Ensures the canvas and camera are updated when the window is resized.
    window.addEventListener('resize', () => {
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        composer.setSize(width, height);
        bloomPass.resolution.set(width, height);
    });
}

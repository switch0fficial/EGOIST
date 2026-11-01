// Three.js 3D Background Scene
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { CatmullRomCurve3 } from 'three/addons/curves/CatmullRomCurve3.js';

// Color palette matching CSS
const colors = {
  black: 0x0b0807,
  darkBrown: 0x1d130f,
  reddishBrown: 0x5a2e22,
  darkMaroon: 0x3a1317,
  red: 0x8f2d27,
  orange: 0xa85a2a,
  amber: 0xb07a2a,
  goldenYellow: 0xa98a3a,
  brightYellow: 0xc9ad4f,
  cream: 0xe3d7bd
};

let scene, camera, renderer, composer;
let buildings, particles, crosshairRings, wireframeShapes;
let curve;
let isMobile = window.innerWidth < 768;
let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let scrollProgress = 0;
let targetScrollProgress = 0;
let mouseX = 0, mouseY = 0;
let time = 0;
let isHidden = false;

// Section moods
const sectionMoods = [
  { fog: colors.darkBrown, fogDensity: 0.02, ambient: colors.amber },
  { fog: colors.darkBrown, fogDensity: 0.025, ambient: colors.goldenYellow },
  { fog: colors.darkMaroon, fogDensity: 0.03, ambient: colors.red },
  { fog: colors.darkBrown, fogDensity: 0.015, ambient: colors.amber },
  { fog: colors.darkBrown, fogDensity: 0.012, ambient: colors.amber }
];

let currentMood = { ...sectionMoods[0] };

function init() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(colors.black);
  scene.fog = new THREE.FogExp2(colors.darkBrown, 0.02);

  // Camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 20);

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // Lighting
  const ambientLight = new THREE.AmbientLight(colors.amber, 0.3);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(colors.goldenYellow, 0.5);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);

  // Create scene elements
  createCityCanyon();
  createAtmosphere();
  createCrosshairRings();
  createWireframeShapes();
  createCameraPath();

  // Post-processing (desktop only)
  if (!isMobile && !isReducedMotion) {
    setupPostProcessing();
  }

  // Event listeners
  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', onMouseMove);
  document.addEventListener('visibilitychange', onVisibilityChange);

  // Start animation loop
  animate();
}

function createCityCanyon() {
  const buildingCount = isMobile ? 150 : 300;
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  geometry.translate(0, 0.5, 0);

  // Create window texture
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1d130f';
  ctx.fillRect(0, 0, 64, 64);

  // Random windows
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 56;
    const y = Math.random() * 56;
    const colors = ['#b07a2a', '#a98a3a', '#a85a2a', '#8f2d27'];
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.globalAlpha = 0.3 + Math.random() * 0.4;
    ctx.fillRect(x, y, 4, 6);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  const material = new THREE.MeshStandardMaterial({
    color: colors.darkBrown,
    map: texture,
    roughness: 0.9,
    metalness: 0.1
  });

  buildings = new THREE.InstancedMesh(geometry, material, buildingCount);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < buildingCount; i++) {
    const x = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 200 - 50;
    const height = 5 + Math.random() * 20;
    const width = 2 + Math.random() * 4;
    const depth = 2 + Math.random() * 4;

    dummy.position.set(x, 0, z);
    dummy.scale.set(width, height, depth);
    dummy.updateMatrix();
    buildings.setMatrixAt(i, dummy.matrix);
  }

  buildings.instanceMatrix.needsUpdate = true;
  scene.add(buildings);

  // Warning lights
  const warningLightGeo = new THREE.SphereGeometry(0.1, 8, 8);
  const warningLightMat = new THREE.MeshBasicMaterial({ color: colors.red });
  const warningLights = new THREE.InstancedMesh(warningLightGeo, warningLightMat, 20);

  for (let i = 0; i < 20; i++) {
    const x = (Math.random() - 0.5) * 80;
    const z = (Math.random() - 0.5) * 150 - 50;
    const height = 10 + Math.random() * 15;

    dummy.position.set(x, height, z);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    warningLights.setMatrixAt(i, dummy.matrix);
  }

  warningLights.instanceMatrix.needsUpdate = true;
  warningLights.userData.blinkOffsets = Array.from({ length: 20 }, () => Math.random() * Math.PI * 2);
  scene.add(warningLights);
  buildings.userData.warningLights = warningLights;
}

function createAtmosphere() {
  // Ember particles
  const particleCount = isMobile ? 500 : 1000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors_attr = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = Math.random() * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200 - 50;

    const color = new THREE.Color();
    const colorChoice = Math.random();
    if (colorChoice < 0.3) color.setHex(colors.amber);
    else if (colorChoice < 0.6) color.setHex(colors.goldenYellow);
    else color.setHex(colors.orange);

    colors_attr[i * 3] = color.r;
    colors_attr[i * 3 + 1] = color.g;
    colors_attr[i * 3 + 2] = color.b;

    sizes[i] = Math.random() * 2;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors_attr, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

function createCrosshairRings() {
  crosshairRings = new THREE.Group();

  const ringMaterial = new THREE.LineBasicMaterial({ color: colors.amber, transparent: true, opacity: 0.5 });

  for (let i = 0; i < 3; i++) {
    const radius = 3 + i * 2;
    const segments = 64;
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let j = 0; j <= segments; j++) {
      const angle = (j / segments) * Math.PI * 2;
      positions.push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const ring = new THREE.Line(geometry, ringMaterial);
    ring.userData.rotationSpeed = (i + 1) * 0.001;
    crosshairRings.add(ring);
  }

  crosshairRings.position.set(0, 3, 5);
  scene.add(crosshairRings);
}

function createWireframeShapes() {
  wireframeShapes = new THREE.Group();

  const shapes = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TetrahedronGeometry(1, 0)
  ];

  const material = new THREE.LineBasicMaterial({ color: colors.goldenYellow, transparent: true, opacity: 0.3 });

  for (let i = 0; i < 5; i++) {
    const geometry = shapes[i % shapes.length];
    const wireframe = new THREE.WireframeGeometry(geometry);
    const line = new THREE.LineSegments(wireframe, material);

    line.position.set(
      (Math.random() - 0.5) * 20,
      Math.random() * 10 + 2,
      (Math.random() - 0.5) * 10
    );

    line.userData.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01
    };

    wireframeShapes.add(line);
  }

  scene.add(wireframeShapes);
}

function createCameraPath() {
  const points = [
    new THREE.Vector3(0, 5, 20),
    new THREE.Vector3(0, 8, 10),
    new THREE.Vector3(0, 6, 0),
    new THREE.Vector3(0, 5, -10),
    new THREE.Vector3(0, 4, -20)
  ];

  curve = new CatmullRomCurve3(points);
}

function setupPostProcessing() {
  composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.4,
    0.5,
    0.85
  );
  composer.addPass(bloomPass);

  // Film grain shader
  const grainShader = {
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0 },
      intensity: { value: 0.05 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float time;
      uniform float intensity;
      varying vec2 vUv;
      float random(vec2 co) {
        return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        float grain = random(vUv + time) * intensity;
        gl_FragColor = color + grain;
      }
    `
  };

  const grainPass = new ShaderPass(grainShader);
  composer.addPass(grainPass);

  // Vignette shader
  const vignetteShader = {
    uniforms: {
      tDiffuse: { value: null }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        vec2 center = vUv - 0.5;
        float dist = length(center);
        float vignette = 1.0 - dist * 0.8;
        gl_FragColor = color * vignette;
      }
    `
  };

  const vignettePass = new ShaderPass(vignetteShader);
  composer.addPass(vignettePass);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (composer) composer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onVisibilityChange() {
  isHidden = document.hidden;
}

function updateScrollProgress(progress) {
  targetScrollProgress = progress;
}

function updateSectionMood(sectionIndex) {
  const mood = sectionMoods[Math.min(sectionIndex, sectionMoods.length - 1)];
  currentMood = mood;
}

function animate() {
  if (isHidden) {
    requestAnimationFrame(animate);
    return;
  }

  time += 0.016;

  // Smooth scroll progress
  scrollProgress += (targetScrollProgress - scrollProgress) * 0.05;

  // Camera movement along curve
  if (curve) {
    const point = curve.getPointAt(scrollProgress);
    const tangent = curve.getTangentAt(scrollProgress);

    camera.position.copy(point);
    camera.position.y += Math.sin(time * 0.5) * 0.2;

    // Mouse parallax
    camera.position.x += mouseX * 0.5;
    camera.position.y += mouseY * 0.3;

    // Look ahead
    const lookAt = curve.getPointAt(Math.min(scrollProgress + 0.1, 1));
    camera.lookAt(lookAt);
  }

  // Crosshair rings rotation
  if (crosshairRings) {
    crosshairRings.children.forEach((ring, i) => {
      ring.rotation.z += ring.userData.rotationSpeed;
    });
    crosshairRings.rotation.y = Math.sin(time * 0.3) * 0.2;
  }

  // Wireframe shapes
  if (wireframeShapes) {
    wireframeShapes.children.forEach((shape) => {
      shape.rotation.x += shape.userData.rotationSpeed.x;
      shape.rotation.y += shape.userData.rotationSpeed.y;
    });
  }

  // Particles drift
  if (particles) {
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(time + positions[i]) * 0.01;
    }
    particles.geometry.attributes.position.needsUpdate = true;
  }

  // Warning lights blink
  if (buildings && buildings.userData.warningLights) {
    const warningLights = buildings.userData.warningLights;
    const material = warningLights.material;
    for (let i = 0; i < 20; i++) {
      const offset = warningLights.userData.blinkOffsets[i];
      const blink = Math.sin(time * 2 + offset) > 0.5 ? 1 : 0.3;
      // Note: InstancedMesh doesn't support per-instance opacity easily
      // So we keep it simple with global pulse
    }
  }

  // Mood transitions
  if (scene.fog) {
    scene.fog.color.lerp(new THREE.Color(currentMood.fog), 0.02);
    scene.fog.density += (currentMood.fogDensity - scene.fog.density) * 0.02;
  }

  // Render
  if (composer && !isMobile) {
    composer.render();
    if (composer.passes[1] && composer.passes[1].uniforms) {
      composer.passes[1].uniforms.time.value = time;
    }
  } else {
    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);
}

// Handle WebGL failure
function onWebGLFailure() {
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    canvas.style.display = 'none';
    document.body.style.background = `linear-gradient(180deg, #0b0807 0%, #1d130f 50%, #3a1317 100%)`;
  }
}

// Initialize
try {
  init();
} catch (error) {
  console.error('WebGL initialization failed:', error);
  onWebGLFailure();
}

export { updateScrollProgress, updateSectionMood };

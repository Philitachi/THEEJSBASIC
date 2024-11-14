import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';

// Scene setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 4); // Adjust initial position for better POV

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls for mouse movement
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth motion
controls.dampingFactor = 0.1;

// Create a realistic donut (torus) with reflective material
const geometry = new THREE.TorusGeometry(1, 0.4, 32, 64);
const material = new THREE.MeshStandardMaterial({
  color: 0xff7b00, // Initial orange color
  metalness: 0.8,
  roughness: 0.2,
});
const donut = new THREE.Mesh(geometry, material);
scene.add(donut);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white ambient light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Initial scene background color
scene.background = new THREE.Color(0x000000); // Black background

// GSAP animations
gsap.to(donut.rotation, {
  x: Math.PI * 2,
  y: Math.PI * 2,
  duration: 6,
  repeat: -1, // Infinite loop
  ease: "power1.inOut",
});

function interpolateColors(startColor, endColor, factor) {
  const r = startColor.r + (endColor.r - startColor.r) * factor;
  const g = startColor.g + (endColor.g - startColor.g) * factor;
  const b = startColor.b + (endColor.b - startColor.b) * factor;
  return new THREE.Color(r, g, b);
}

gsap.to(material.color, {
  r: Math.random(),
  g: Math.random(),
  b: Math.random(),
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  onUpdate: () => {
    // Blend scene background with the material color
    const blendedColor = interpolateColors(new THREE.Color(0x000000), material.color, 0.5); // 50% blend
    scene.background = blendedColor;
  },
});

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  controls.update(); // Update orbit controls
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

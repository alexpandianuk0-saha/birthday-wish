import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, particles, composer, controls;
let time = 0;
let isAnimationEnabled = true;
let currentTheme = 'molten';
let morphTarget = 0;
let morphProgress = 0;
const particleCount = 10000;

const themes = {
  molten: {
    colors: [new THREE.Color(0xff4800), new THREE.Color(0xff8c00), new THREE.Color(0xd73a00), new THREE.Color(0x3d1005), new THREE.Color(0xffc600)],
    bloom: { strength: 0.35, radius: 0.45, threshold: 0.7 }
  },
  cosmic: {
    colors: [new THREE.Color(0x6a0dad), new THREE.Color(0x9370db), new THREE.Color(0x4b0082), new THREE.Color(0x8a2be2), new THREE.Color(0xdda0dd)],
    bloom: { strength: 0.4, radius: 0.5, threshold: 0.65 }
  },
  emerald: {
    colors: [new THREE.Color(0x00ff7f), new THREE.Color(0x3cb371), new THREE.Color(0x2e8b57), new THREE.Color(0x00fa9a), new THREE.Color(0x98fb98)],
    bloom: { strength: 0.3, radius: 0.6, threshold: 0.75 }
  }
};

document.addEventListener('DOMContentLoaded', init);

/* ================= ANIMATION FUNCTIONS ================= */

function createHeartPath(i, total) {
  const t = (i / total) * Math.PI * 2;
  const scale = 2.2;
  let x = 16 * Math.pow(Math.sin(t), 3);
  let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  const z = Math.sin(t * 4) * 2;
  return new THREE.Vector3(x*scale, y*scale, z);
}

function createStarPath(i, total) {
  const angle = (i / total) * Math.PI * 2;
  const radius = 35;
  return new THREE.Vector3(Math.cos(angle)*radius, Math.sin(angle)*radius, 0);
}

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1500);
  camera.position.z = 90;

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container')?.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());
  scene.userData.bloomPass = bloomPass;

  createParticleSystem();
  window.addEventListener('resize', onWindowResize);
  setTheme(currentTheme);
  animate();
}

function createParticleSystem() {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount*3);
  const colors = new Float32Array(particleCount*3);
  const sizes = new Float32Array(particleCount);

  const starPositions = new Float32Array(particleCount*3);
  const heartPositions = new Float32Array(particleCount*3);

  for(let i=0;i<particleCount;i++){
    const i3=i*3;
    const star=createStarPath(i, particleCount);
    const heart=createHeartPath(i, particleCount);
    positions[i3]=star.x; positions[i3+1]=star.y; positions[i3+2]=star.z;
    starPositions[i3]=star.x; starPositions[i3+1]=star.y; starPositions[i3+2]=star.z;
    heartPositions[i3]=heart.x; heartPositions[i3+1]=heart.y; heartPositions[i3+2]=heart.z;
    const col=themes[currentTheme].colors[0];
    colors[i3]=col.r; colors[i3+1]=col.g; colors[i3+2]=col.b;
    sizes[i]=1;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors,3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes,1));
  geometry.setAttribute('starPosition', new THREE.BufferAttribute(starPositions,3));
  geometry.setAttribute('heartPosition', new THREE.BufferAttribute(heartPositions,3));

  const material=new THREE.PointsMaterial({size:2.8, vertexColors:true, transparent:true, blending:THREE.AdditiveBlending});
  particles=new THREE.Points(geometry,material);
  scene.add(particles);
}

function animateParticles(){
  if(!particles||!isAnimationEnabled) return;
  const pos=particles.geometry.attributes.position.array;
  const starPos=particles.geometry.attributes.starPosition.array;
  const heartPos=particles.geometry.attributes.heartPosition.array;

  morphProgress += (morphTarget-morphProgress)*0.04;

  for(let i=0;i<particleCount;i++){
    const i3=i*3;
    pos[i3] += (THREE.MathUtils.lerp(starPos[i3], heartPos[i3], morphProgress)-pos[i3])*0.05;
    pos[i3+1] += (THREE.MathUtils.lerp(starPos[i3+1], heartPos[i3+1], morphProgress)-pos[i3+1])*0.05;
    pos[i3+2] += (THREE.MathUtils.lerp(starPos[i3+2], heartPos[i3+2], morphProgress)-pos[i3+2])*0.05;
  }
  particles.geometry.attributes.position.needsUpdate=true;
}

function animate(){
  requestAnimationFrame(animate);
  time+=0.02;
  controls.update();
  animateParticles();
  composer.render();
}

function onWindowResize(){
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

function setTheme(themeName){
  if(!themes[themeName]) return;
  currentTheme=themeName;
  document.body.className=`theme-${currentTheme}`;
  const bloomPass=scene.userData.bloomPass;
  if(bloomPass){
    bloomPass.strength=themes[themeName].bloom.strength;
    bloomPass.radius=themes[themeName].bloom.radius;
    bloomPass.threshold=themes[themeName].bloom.threshold;
  }
}

/* ================= PAGE LOGIC ================= */

// Page 1 - index.html
function checkName() {
  const nameInput=document.getElementById('nameInput');
  if(!nameInput) return;
  const name=nameInput.value.trim();
  const error=document.getElementById('errorMsg');
  if(name.toLowerCase() === 'sahana'){
    localStorage.setItem('name', name);
    window.location.href='birthday.html';
  } else {
    error.textContent='This message is not for you 💔';
  }
}

// Page 2 - birthday.html
function showBirthdayWish() {
  const wishEl=document.getElementById('wish');
  const name=localStorage.getItem('name');
  if(!name) window.location.href='index.html';
  if(wishEl) wishEl.textContent=`Happy Birthday, ${name} 🎂💖`;
}
function showMessage() { window.location.href='message.html'; }

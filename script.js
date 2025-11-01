import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js';

let scene, camera, renderer, particles;

document.addEventListener("DOMContentLoaded", () => {
  // ------------------ Three.js Neon Heart ------------------
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(renderer.domElement);

  const particleCount = 5000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount*3);

  for (let i=0;i<particleCount;i++){
    const t = Math.random()*Math.PI*2;
    const x = 16*Math.pow(Math.sin(t),3);
    const y = 13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t);
    const z = (Math.random()-0.5)*2;
    positions[i*3] = x;
    positions[i*3+1] = y;
    positions[i*3+2] = z;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));

  const material = new THREE.PointsMaterial({
    color: 0xff69b4,
    size: 0.5,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animateParticles();

  // ------------------ Name Handling & Page Navigation ------------------
  const nameInput = document.getElementById("nameInput");
  const submitBtn = document.getElementById("submitBtn");
  const errorMsg = document.getElementById("errorMsg");

  if(submitBtn){
    submitBtn.addEventListener("click", ()=>{
      const name = nameInput.value.trim().toLowerCase();
      if(name==="sahana"){
        localStorage.setItem("userName","Sahana");
        window.location.href = "birthday.html";
      } else {
        errorMsg.textContent = "This message is not for you!";
      }
    });
  }

  const wishName = document.getElementById("wishName");
  const showMessageBtn = document.getElementById("showMessage");

  if(wishName){
    const name = localStorage.getItem("userName") || "";
    wishName.textContent = `Happy Birthday, ${name}!`;
  }

  if(showMessageBtn){
    showMessageBtn.addEventListener("click", ()=>{
      window.location.href = "message.html";
    });
  }

  const finalQuote = document.getElementById("finalQuote");
  if(finalQuote){
    finalQuote.textContent = "You bring so much joy and happiness into my world. Wishing a wonderful birthday to the woman who holds my heart. You are my everything. Love you, Ammu ❤️";
  }

});

function animateParticles(){
  requestAnimationFrame(animateParticles);
  particles.rotation.y += 0.001;
  particles.rotation.x += 0.001;
  renderer.render(scene, camera);
}

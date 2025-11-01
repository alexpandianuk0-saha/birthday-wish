document.addEventListener("DOMContentLoaded", () => {
  // ------------------------
  // Three.js heart animation
  // ------------------------
  let scene, camera, renderer, particles;
  const particleCount = 5000;

  init();
  animate();

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 80;

    renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    createParticles();
    window.addEventListener('resize', onResize);
  }

  function createParticles(){
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount*3);

    for(let i=0;i<particleCount;i++){
      const t = Math.random()*Math.PI*2;
      const scale = 2.2;

      let x = 16*Math.pow(Math.sin(t),3);
      let y = 13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);

      positions[i*3] = x*scale + (Math.random()-0.5)*0.2;
      positions[i*3+1] = y*scale + (Math.random()-0.5)*0.2;
      positions[i*3+2] = (Math.sin(t*4)*2) + (Math.random()-0.5)*0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
    const material = new THREE.PointsMaterial({ size:2.5, color:0xff4081, transparent:true, blending: THREE.AdditiveBlending, depthWrite:false });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
  }

  function animate(){
    requestAnimationFrame(animate);
    if(particles) particles.rotation.y += 0.002;
    renderer.render(scene, camera);
  }

  function onResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // ------------------------
  // Name validation (only on index.html)
  // ------------------------
  const submitBtn = document.getElementById("submitName");
  if(submitBtn){
    submitBtn.onclick = () => {
      const val = document.getElementById("nameInput").value.trim().toLowerCase();
      if(val === "sahana") {
        localStorage.setItem("name","Sahana");
        window.location.href="birthday.html";
      } else {
        document.getElementById("errorMsg").style.display="block";
      }
    };
  }
});

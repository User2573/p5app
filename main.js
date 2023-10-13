import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
})





const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const group = new THREE.Group();
for (const _ of Array(10).keys()) {
    const geometry = new THREE.BoxGeometry(1,1,1);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 15-3*_, 0);
    group.add(mesh);
}
scene.add(group);

function animate() {
    camera.position.z = 15;
    
    for (const obj of group.children) {
        obj.rotation.x += 0.01;
        obj.rotation.y += 0.01;
    }
    
	renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

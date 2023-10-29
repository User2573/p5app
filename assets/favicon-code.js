import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.min.js';
document.body.innerHTML = '<image></image>';
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false
});
renderer.setSize(512, 512);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({
  color: 0x70a000,
  shininess: 200
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
cube.rotation.z = 1.2;

const s = 5;
const light = new THREE.PointLight(0xffffff, 1500);
light.position.set(-2, 3, -4);

//scene.add(new THREE.PointLightHelper(light, 1))
scene.add(light);

scene.add(new THREE.AmbientLight(0x505050));
camera.position.set(1.2, 0.2, 1).multiplyScalar(1.5);
camera.lookAt(0, 0, 0);

const dir = new THREE.DirectionalLight(0xffffff, 7.9);
dir.position.set(-0.1, -1, -2);
scene.add(dir);

renderer.render(scene, camera);
const canv = renderer.domElement;
document.body.children[0].src=canv.toDataURL();
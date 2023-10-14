import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
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
});
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new ShaderPass({
	uniforms: {
		'tDiffuse': { value: null },
	},

	vertexShader: /* glsl */`
        varying vec2 uv;
		void main() {
            uv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`
		uniform float opacity;
		uniform sampler2D tDiffuse;
		varying vec2 uv;

		void main() {
			vec4 texel = texture2D( tDiffuse, uv );
			gl_FragColor = texel;
		}`
}));
composer.addPass(new OutputPass());





const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    shininess: 80
});
const group = new THREE.Group();
for (const i of Array(10).keys()) {
    for (const j of Array(10).keys()) {
    const geometry = new THREE.BoxGeometry(1,1,1);
    const mesh = new THREE.Mesh(geometry, material);
    const rand = () => -15+30*Math.random()
    mesh.position.set(rand(), rand(), 0);
    mesh.quaternion.set(rand(),rand(),rand(),rand()).normalize();
    group.add(mesh);
    }
}
scene.add(group);

const directionalLight = new THREE.DirectionalLight(0xffffff, .2);
directionalLight.position.set(1,2,3);
scene.add(directionalLight);
const pointLight = new THREE.PointLight(0xffffff, 500);
pointLight.position.set(0,0,-5);
scene.add(pointLight);
scene.add(new THREE.AmbientLight(0x202020));

let time = 0;
function animate() {
    time += .005;
    camera.position.z = 15;
    pointLight.position.x = 15 * Math.cos(5*time);
    pointLight.position.y = 15 * Math.sin(4*time);
    
    for (const obj of group.children) {
        obj.rotation.x = Math.abs(Math.sin(obj.position.x))*time;
        obj.rotation.y = Math.abs(Math.sin(obj.position.y))*time;
    }
    
	composer.render();
    requestAnimationFrame(animate);
}

animate();

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(Math.max(2,window.devicePixelRatio));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);






const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    shininess: 80
});
const group = new THREE.Group();
for (const i of Array(20).keys()) {
    for (const j of Array(20).keys()) {
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






const clock = new THREE.Clock();

const composer = new EffectComposer(renderer);
const postShader = new ShaderPass({
	uniforms: {
		'tDiffuse': { value: null },
        'uTime': { value: 0 },
        'uResolution' : { value: renderer.getSize(new THREE.Vector2()) }
	},
	vertexShader: `varying vec2 UV;void main(){UV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1);}`,
	fragmentShader: await (await fetch('postprocessing.frag')).text()
});
composer.addPass(new RenderPass(scene, camera));
composer.addPass(postShader);
composer.addPass(new OutputPass());


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    renderer.getSize(postShader.material.uniforms.uResolution.value);
});







camera.position.z = 15;
function animate() {
    const time = .5*clock.getElapsedTime();
    postShader.material.uniforms.uTime.value = time;
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

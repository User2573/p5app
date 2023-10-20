import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);






const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    shininess: 200
});
const group = new THREE.Group();
for (const i of Array(10).keys()) {
    for (const j of Array(10).keys()) {
        const rand = Math.random;
        const geometry = new THREE.BoxGeometry(1,1,1);
        geometry.applyQuaternion(new THREE.Quaternion(rand(),rand(),rand(),rand()).normalize());
        const mesh = new THREE.Mesh(geometry, material.clone());
        mesh.position.set(2*i-10+2*rand(),2*j-10+2*rand(),-1+2*rand())
        mesh.material.color.add(new THREE.Color(rand()-.5,rand()-.5,rand()-.5).multiplyScalar(.7));
        group.add(mesh);
    }
}
scene.add(group);

scene.add(new THREE.AmbientLight(0x202020));
const directionalLight = new THREE.DirectionalLight(0xffffff, .5);
directionalLight.position.set(1,2,3);
scene.add(directionalLight);
const pointLight = new THREE.PointLight(0xffffff, 500);
scene.add(pointLight);






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
    const time = clock.getElapsedTime();
    postShader.material.uniforms.uTime.value = time;
    pointLight.position.x = 15 * Math.cos(1.9*time);
    pointLight.position.y = 15 * Math.sin(1*time);
    pointLight.position.z = -5;
    
    for (const obj of group.children) {
        obj.rotation.x = .2*time * Math.abs(Math.sin(100*obj.position.x));
        obj.rotation.y = .2*time * Math.abs(Math.sin(100*obj.position.y));
    }
    
	composer.render();
    requestAnimationFrame(animate);
}

animate();

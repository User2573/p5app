import * as THREE from 'three';



const Animator = new (class Animator {
    clock = new THREE.Clock(false);
    #callbacks = [];

    #animate() {
        const time = this.clock.getElapsedTime();
        const dt = this.clock.getDelta();
        for (const callback of this.#callbacks) {
            callback(time, dt);
        }
        requestAnimationFrame(() => this.#animate());
    }

    constructor() {
        this.clock.start();
        this.#animate();
    }

    addCallback(callback) {
        this.#callbacks.push(callback);
    }
})();





const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})









import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';



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

Animator.addCallback(time => {
    renderer.getSize(postShader.material.uniforms.uResolution.value);
    composer.render();
    postShader.material.uniforms.uTime.value = time;
});





window.addEventListener('resize', () => {
    composer.setSize(window.innerWidth, window.innerHeight);
});







camera.position.z = 15;
// function animate0() {
//     const time = clock.getElapsedTime();
//     postShader.material.uniforms.uTime.value = time;

    

    
// 	composer.render();
//     requestAnimationFrame(animate0);
// }

// animate0();
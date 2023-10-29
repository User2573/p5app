import * as THREE from 'three';
import { Animator } from '../animator.js';

const animator = new Animator();

const mousePosition = new THREE.Vector2();




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );







const canvas = document.getElementsByTagName('canvas')[0];
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setPixelRatio(1);


import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';


const composer = new EffectComposer(renderer);
const highlightShader = new ShaderPass({
	uniforms: {
		'tDiffuse': { value: null },
        'uCorner' : { value: new THREE.Vector2(0) },
        'uDimensions' : { value: new THREE.Vector2(0) },
        'uMouse': { value: new THREE.Vector2(0) }, 
	},
	vertexShader: `varying vec2 UV;void main(){UV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1);}`,
	fragmentShader: await (await fetch('scripts/app/mouseHover.frag')).text()
});
composer.addPass(new RenderPass(scene, camera));
composer.addPass(highlightShader);
composer.addPass(new OutputPass());


window.addEventListener('mousemove', e => {
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
    highlightShader.material.uniforms.uMouse.value = mousePosition;
});

window.addEventListener('resize', () => {
    const { x, y, width, height } = canvas.parentNode.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);

    highlightShader.material.uniforms.uCorner.value.set(x, y);
    highlightShader.material.uniforms.uDimensions.value.set(width, height);
})
window.dispatchEvent(new Event('resize'));



animator.addCallback(() => composer.render());

animator.start();
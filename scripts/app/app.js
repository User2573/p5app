import * as THREE from 'three';
import { Animator } from '../animator.js';

const animator = new Animator();

const mousePosition = new THREE.Vector2();




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

scene.background = new THREE.Color('rgb(7, 7, 10)');






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
const computedStyle = getComputedStyle(document.getElementsByTagName('canvas')[0]);
console.log(computedStyle.getPropertyValue('--border-color'));
const highlightShader = new ShaderPass({
	uniforms: {
		'tDiffuse': { value: null },
        'uCorner' : { value: new THREE.Vector2() },
        'uDimensions' : { value: new THREE.Vector2() },
        'uBorderRadius': { value: parseFloat(computedStyle.borderRadius) },
        'uBorderWidth': { value: parseFloat(computedStyle.getPropertyValue('--border-width')) },
        'uBorderColor': { value: new THREE.Vector4(...computedStyle.getPropertyValue('--border-color').match(/[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/g).map((n, i) => parseFloat(n) / (i == 3 ? 1 : 255))) },
        'uMouse': { value: new THREE.Vector2() }, 
	},
	vertexShader: `varying vec2 UV;void main(){UV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1);}`,
	fragmentShader: await (await fetch('scripts/app/mouseHover.frag')).text()
});
console.log(highlightShader.material.uniforms)
composer.addPass(new RenderPass(scene, camera));
composer.addPass(highlightShader);
composer.addPass(new OutputPass());


window.addEventListener('mousemove', e => {
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
    highlightShader.material.uniforms.uMouse.value = mousePosition;
});

window.dispatchEvent(new Event('mousemove'));

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
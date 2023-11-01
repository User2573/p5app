import * as THREE from 'three';
import { Animator } from '../animator.js';

const animator = new Animator();

const mousePosition = new THREE.Vector2();




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

scene.background = new THREE.Color('rgb(7, 7, 10)');




class Trail {
    constructor(points, color) {
        this.points = points;
        this.mesh = new THREE.Line(
            new THREE.BufferGeometry()
                .setAttribute('position', new THREE.BufferAttribute(
                    new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))
                ).setUsage(THREE.StreamDrawUsage))
                .setAttribute('color', new THREE.BufferAttribute(
                    new Float32Array(Array(points.length).fill(0).map((x, i) => {
                        const t = i / points.length;
                        return color.clone().lerp(scene.background, t*(2-t));
                    }).flatMap(c => [c.r, c.g, c.b])),
                3)),
            new THREE.LineBasicMaterial({ vertexColors: true })
        );
        this.mesh.frustumCulled = false;
    }

    addPoint(point) {
        this.points.unshift(point);
        this.points.pop();
        this.mesh.geometry.setFromPoints(this.points);
    }
}

const axis = () => new THREE.Vector3(1, 2, 3).normalize();
const lines = [];
const balls = [];

for (let i = 0; i < 30; i++) {
    const point = new THREE.Vector3().randomDirection().setLength(Math.sqrt(Math.random()));
    const axisToPoint = point.clone().sub(point.clone().projectOnVector(axis())).normalize();
    point.add(axisToPoint.multiplyScalar(.05));
    point.multiplyScalar(10);

    const closestPoint = new THREE.Vector3();
    new THREE.Line3(axis()).closestPointToPoint(point, false, closestPoint)
    const n = 10+Math.floor(20*closestPoint.sub(point).length());
    const points = Array(n).fill(0).map(() => point.clone());
    const color = new THREE.Color(.2, .3, .6).add(new THREE.Color().setFromVector3(new THREE.Vector3().random().addScalar(-.8).multiplyScalar(.2)).multiplyScalar(Math.random()));
    const line = new Trail(points, color);
    scene.add(line.mesh);
    lines.push(line);
}



animator.addCallback(time => {
    camera.position.set(Math.cos(time/8), 0, Math.sin(time/8)).multiplyScalar(15);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    
    
    for (const line of lines) {
        const point = line.points[0];
        const dist2 = point.distanceToSquared(point.clone().projectOnVector(axis()));
        const speed = Math.pow(dist2, -.25);
        const newPoint = point.clone().applyAxisAngle(axis(), .1*speed);
        line.addPoint(newPoint);
    }
    return;
})










const canvas = document.getElementsByTagName('canvas')[0];
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;




/*
    BORDER POST PROCESSING
*/

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';


const composer = new EffectComposer(renderer);
const computedStyle = getComputedStyle(document.getElementsByTagName('canvas')[0]);
const borderColorComponents = computedStyle.getPropertyValue('--border-color').match(/[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/g).map((n, i) => parseFloat(n) / (i == 3 ? 1 : 255));
const borderColor = new THREE.Color(...borderColorComponents).convertSRGBToLinear();
const highlightShader = new ShaderPass({
	uniforms: {
		'tDiffuse': { value: null },
        'uCorner' : { value: new THREE.Vector2() },
        'uDimensions' : { value: new THREE.Vector2() },
        'uBorderRadius': { value: parseFloat(computedStyle.borderRadius) },
        'uBorderWidth': { value: parseFloat(computedStyle.getPropertyValue('--border-width')) },
        'uBorderColor': { value: new THREE.Vector4(borderColor.r, borderColor.g, borderColor.b, borderColorComponents[3]) },
        'uMouse': { value: new THREE.Vector2() }, 
	},
	vertexShader: `varying vec2 UV;void main(){UV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1);}`,
	fragmentShader: await (await fetch('scripts/app/mouseHover.frag')).text()
});
composer.addPass(new RenderPass(scene, camera));
composer.addPass(highlightShader);
composer.addPass(new ShaderPass(GammaCorrectionShader));
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
import * as THREE from 'three';



const animator = new (class Animator {
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

    addCallback(callback) {
        this.#callbacks.push(callback);
    }

    start() {
        this.clock.start();
        this.#animate();
    }
})();





const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);





class Trail {
    constructor(points, material) {
        this.point = points[0];
        this.positions = new Float32Array(points.flatMap(p => [p.x, p.y, p.z]));
        this.mesh = new THREE.Mesh(
            new THREE.BufferGeometry().setAttribute('position',
                new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.StreamDrawUsage)
            ),
            material
        );
    }

    addPoint(point) {
        this.point = point;
        this.positions.copyWithin(3, 0, this.positions.length);
        this.positions[0] = point.x;
        this.positions[1] = point.y;
        this.positions[2] = point.z;
    }
};

const axis = new THREE.Vector3(1, 2, 3).normalize();
const trails = [];
for (let i = 0; i < 1; i++) {
    const length = i + 50;
    const points = Array(length).fill(0).map(() => new THREE.Vector3(
        Math.cos(7*i),
        Math.sin(11*i),
        Math.cos(13*i)
    ));
    const trail = new Trail(
        points,
        new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 100
        })
    );
    scene.add(trail.mesh);
    trails.push(trail);
}

animator.addCallback((time, dt) => {
    for (const trail of trails) {
        const newPoint = trail.point.clone().add(axis.clone().multiplyScalar(.1));
        trail.addPoint(newPoint);
    }
});










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

animator.addCallback(time => {
    renderer.getSize(postShader.material.uniforms.uResolution.value);
    composer.render();
    postShader.material.uniforms.uTime.value = time;
});





window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});







animator.start();
// function animate0() {
//     const time = clock.getElapsedTime();
//     postShader.material.uniforms.uTime.value = time;

    

    
// 	composer.render();
//     requestAnimationFrame(animate0);
// }

// animate0();
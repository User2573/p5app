import * as THREE from 'three';

const animator = new (class Animator {
    #clock = new THREE.Clock(false);
    #callbacks = [];

    #animate() {
        // dt before time since getElapsedTime resets delta counter
        const dt = this.#clock.getDelta();
        const time = this.#clock.getElapsedTime();
        for (const callback of this.#callbacks) {
            callback(time, dt);
        }
        requestAnimationFrame(() => this.#animate());
    }

    addCallback(callback) {
        this.#callbacks.push(callback);
    }

    start() {
        this.#clock.start();
        this.#animate();
    }
})();





const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.z = 15;

const dimensions = new THREE.Vector3();
const scale = 2;
const updateDimensions = () =>
{
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(2,2), camera);
    raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 15), dimensions);
    dimensions.divideScalar(scale);
    dimensions.ceil();
};
updateDimensions();


const instances = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 200
    }),
    dimensions.x * dimensions.y
);
for (const i of Array(dimensions.x).keys()) {
    for (const j of Array(dimensions.y).keys()) {
        const index = i * dimensions.y + j;
        //geometry.applyQuaternion();

        instances.setMatrixAt(index, new THREE.Matrix4().compose(
                new THREE.Vector3(
                    (i - dimensions.x/2 + .5)*scale,
                    (j - dimensions.y/2 + .5)*scale,
                    0
                ).add(
                    new THREE.Vector3().randomDirection().multiply(new THREE.Vector3(1, 1, 3))
                ),
                new THREE.Quaternion().random(),
                new THREE.Vector3(1, 1, 1)
            )
        );

        instances.setColorAt(index, new THREE.Color()
        .setFromVector3(new THREE.Vector3()
            .random()
            .addScalar(-.5)
            .multiplyScalar(.5)
            .add(new THREE.Vector3(0, 1, 0))))

    }
}
instances.instanceColor.needsUpdate = true;
scene.add(instances);


scene.add(new THREE.AmbientLight(0x202020));
const directionalLight = new THREE.DirectionalLight(0xffffff, .5);
directionalLight.position.set(1,2,3);
scene.add(directionalLight);
const pointLight = new THREE.PointLight(0xffffff, 500);
scene.add(pointLight);

animator.addCallback((time, dt) => {
    for (let i = 0; i < dimensions.x * dimensions.y; i++) {
        const mat = new THREE.Matrix4();
        instances.getMatrixAt(i, mat);
        mat.multiply(new THREE.Matrix4().makeRotationFromEuler(
            new THREE.Euler(.2*dt, .2*dt, 0)
        ));
        instances.setMatrixAt(i, mat);
    }
    instances.instanceMatrix.needsUpdate = true;

    pointLight.position.set(
        dimensions.x*scale * Math.cos(1.9*time),
        dimensions.y*scale * Math.sin(1.0*time),
        -5
    );
})







import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';



const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
const postShader = new ShaderPass({
	uniforms: {
		'tDiffuse': { value: null },
        'uTime': { value: 0 },
        'uResolution' : { value: renderer.getSize(new THREE.Vector2()) }
	},
	vertexShader: `varying vec2 UV;void main(){UV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1);}`,
	fragmentShader: await (await fetch('loginBackground/postprocessing.frag')).text()
});
composer.addPass(new RenderPass(scene, camera));
composer.addPass(postShader);
composer.addPass(new OutputPass());

animator.addCallback(time => {
    postShader.material.uniforms.uTime.value = time;
    composer.render();
});





window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    renderer.getSize(postShader.material.uniforms.uResolution.value);

    updateDimensions();
    console.log([dimensions.x, dimensions.y])
});







animator.start();
// function animate0() {
//     const time = clock.getElapsedTime();
//     postShader.material.uniforms.uTime.value = time;

    

    
// 	composer.render();
//     requestAnimationFrame(animate0);
// }

// animate0();
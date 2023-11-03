import * as THREE from 'three';
import { Animator } from '../animator.js'

const animator = new Animator();

export const stopAnimation = () => animator.stop();
export const toggleStats = () => animator.toggleStats();





const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.z = 15;

const dimensions = new THREE.Vector3();
const scale = 2;
const updateDimensions = () =>
{
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(1, 1), camera);
    raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), camera.position.z), dimensions);
    dimensions.divideScalar(scale);
    dimensions.ceil();
};
updateDimensions();
dimensions.multiplyScalar(2);


const positions = Array(dimensions.x * dimensions.y).fill(0);
const instances = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 200
    }),
    positions.length
);
for (const i of Array(dimensions.x).keys()) {
    for (const j of Array(dimensions.y).keys()) {
        const index = i * dimensions.y + j;
        
        positions[index] = new THREE.Vector3(
            (i - dimensions.x/2 + .5)*scale,
            (j - dimensions.y/2 + .5)*scale,
            0
        ).add(
            new THREE.Vector3().randomDirection().multiply(new THREE.Vector3(1, 1, 3))
        );

        instances.setMatrixAt(index, new THREE.Matrix4().compose(
            positions[index],
            new THREE.Quaternion(),
            new THREE.Vector3(1, 1, 1)
        ));

        instances.setColorAt(index, new THREE.Color()
            .setFromVector3(new THREE.Vector3()
            .random()
            .addScalar(-.5)
            .multiplyScalar(.5)
            .add(new THREE.Vector3(0, 1, 0)))
        );
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
    for (let i = 0; i < positions.length; i++) {
        const position = new THREE.Vector3();
        const rotation = new THREE.Quaternion();
        const mat = new THREE.Matrix4();
        instances.getMatrixAt(i, mat);
        mat.decompose(position, rotation, new THREE.Vector3());
        
        if (backgroundSecret.value) {
            const newPosition =  position.clone().add(position.clone().cross(pointLight.position).normalize().multiplyScalar(.1)).setLength(position.length());
            newPosition.lerp(positions[i], .2);
            position.fromArray(newPosition.toArray());
        } else {
        }

        position.fromArray(!backgroundSecret.value ?
            positions[i].toArray() :
            position.clone().add(position.clone().cross(pointLight.position).normalize().multiplyScalar(.1)).setLength(position.length()).lerp(positions[i], .2).toArray()
        );

        const hash = new THREE.Vector3(Math.sin(position.x), Math.cos(position.y), Math.tan(position.z)).normalize();
        const speed = backgroundSecret.value ? 5. : .2;
        const newRotation = new THREE.Quaternion().setFromAxisAngle(hash, hash.x + speed*time);
        rotation.fromArray(newRotation.toArray());

        instances.setMatrixAt(i, mat.compose(position, rotation, new THREE.Vector3(1, 1, 1)));
    }
    instances.instanceMatrix.needsUpdate = true;

    if (backgroundSecret.value) {
        time = 5. * time;
    }
    pointLight.position.set(
        dimensions.x*scale * Math.cos(.9*time),
        dimensions.y*scale * Math.sin(.5*time),
        -5
    );
})







import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';



const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(.3);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
const postShader = new ShaderPass({
	uniforms: {
		'tDiffuse': { value: null },
        'uTime': { value: 0 },
        'uResolution' : { value: renderer.getSize(new THREE.Vector2()) },
        'uBackground' : { value: false }
	},
	vertexShader: `varying vec2 UV;void main(){UV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1);}`,
	fragmentShader: await (await fetch('scripts/login/backgroundPostprocessing.frag')).text()
});
composer.addPass(new RenderPass(scene, camera));
composer.addPass(postShader);
composer.addPass(new OutputPass());

animator.addCallback(time => {
    postShader.material.uniforms.uTime.value = time;
    composer.render();
});

const backgroundSecret = postShader.material.uniforms.uBackground;
export const toggleBackgroundSecret = () => {
    backgroundSecret.value = !backgroundSecret.value;
};
export const toggleBackgroundResolution = () => {
    renderer.setPixelRatio(1.3 - renderer.getPixelRatio())
    composer.setPixelRatio(renderer.getPixelRatio());
}





window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    renderer.getSize(postShader.material.uniforms.uResolution.value);

    updateDimensions();
});







animator.start();
import * as THREE from 'three';
import { Animator } from './animator.js';


const animator = new Animator();




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

const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    shininess: 200
});
const group = new THREE.Group();
for (const i of Array(dimensions.x).keys()) {
    for (const j of Array(dimensions.y).keys()) {
        const geometry = new THREE.BoxGeometry(1,1,1);
        geometry.applyQuaternion(new THREE.Quaternion().random());

        const mesh = new THREE.Mesh(geometry, material.clone());

        mesh.position.set(
            (i - dimensions.x/2 + .5)*scale,
            (j - dimensions.y/2 + .5)*scale,
            0
        ).add(new THREE.Vector3().randomDirection());
        mesh.position.z *= 3;

        mesh.material.color.add(new THREE.Color()
            .setFromVector3(new THREE.Vector3()
                .random()
                .addScalar(-.5))
            .multiplyScalar(.7)
        );

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

animator.addCallback(time => {
    for (const obj of group.children) {
        obj.rotation.x = .2*time * Math.abs(Math.sin(100*obj.position.x));
        obj.rotation.y = .2*time * Math.abs(Math.sin(100*obj.position.y));
    }

    pointLight.position.set(
        dimensions.x*scale * Math.cos(2.3*time),
        dimensions.y*scale * Math.sin(1.3*time),
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
	fragmentShader: await (await fetch('postprocessing-login.frag')).text()
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
});







animator.start();
// function animate0() {
//     const time = clock.getElapsedTime();
//     postShader.material.uniforms.uTime.value = time;

    

    
// 	composer.render();
//     requestAnimationFrame(animate0);
// }

// animate0();
function makeFavicon(THREE) {
    document.body.innerHTML = '<image></image>';
    const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
    });
    renderer.setSize(512, 512);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
    color: 0x70a000,
    shininess: 200
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.rotation.z = 1.2;

    const s = 5;
    const light = new THREE.PointLight(0xffffff, 1500);
    light.position.set(-2, 3, -4);

    //scene.add(new THREE.PointLightHelper(light, 1))
    scene.add(light);

    scene.add(new THREE.AmbientLight(0x505050));
    camera.position.set(1.2, 0.2, 1).multiplyScalar(1.5);
    camera.lookAt(0, 0, 0);

    const dir = new THREE.DirectionalLight(0xffffff, 7.9);
    dir.position.set(-0.1, -1, -2);
    scene.add(dir);

    renderer.render(scene, camera);
    const canv = renderer.domElement;
    document.body.children[0].src=canv.toDataURL();
}




/*
    SECRET FOR LOGIN PAGE
*/
import { toggleStats, toggleBackgroundSecret, toggleBackgroundResolution } from '../scripts/login/backgroundAnimation.js';
const parseHTMLElement = s => {
    const elem = document.createElement('div');
    elem.innerHTML = s;
    if (elem.children.length !== 1) {
        throw new Error('parseHTMLElement: input string must contain exactly one HTML element')
    }
    return elem.children[0];
};

document.head.appendChild(parseHTMLElement(`
<style>
dialog, dialog * {
    outline: none;
    border: none;
    user-select: none;
    -webkit-user-select: none;
}
dialog {
    padding: 1rem 2rem;
    border-radius: 1rem;
    background: white;
    color: black;
}
dialog::backdrop {
    background: rgb(0 0 0 / .5);
}
dialog h1 {
    font-size: 1.5rem;
    margin: 0;
}
dialog p {
    margin: 0 0 1rem 0;
    font-size: .8rem;
}
dialog button {
    all: unset;
    display: block;
    margin-bottom: .5rem;
    font-family: 'Inter', sans-serif;
    font-size: .8rem;
}
dialog button:hover {
    text-decoration: underline;
}
</style>
`));

const dialog = parseHTMLElement(`
<dialog id='secret-menu'>
    <h1>secret!</h1>
    <p>press [esc] to exit</p>

    <button id="dfillForm">Fill in the current form</button>
    <button id="dbackground">Make background more epic</button>
    <button id="dhighres">Toggle full resolution background</button>
    <button id="dperformance">Show performance</button>
    <button id="dredirect">See something cool</button>
</dialog>
`)
document.body.appendChild(dialog);

const secretMenu = document.getElementById('secret-menu');
const secretTrigger = document.getElementById('secret-trigger');

const buttons = Array.from(dialog.children).filter(elem => elem.tagName === 'BUTTON');



export const secret = ({ isLoginPage, usernameInput, passwordInput, confirmInput }) => {

    const clickCallbacks = {
        fillForm: () => {
            usernameInput.value = isLoginPage ? 'adasda' : 'adasds';
            passwordInput.value = confirmInput.value = 'abfhd3fgh';
        },
        background: toggleBackgroundSecret,
        highres: toggleBackgroundResolution,
        performance: toggleStats,
        redirect: () => { window.location.href = 'https://youtu.be/dQw4w9WgXcQ' }
    }

    for (const button of buttons) {
        button.addEventListener('click', () => {
            clickCallbacks[button.id.slice(1)]();
            dialog.close();
        });
    }



    secretTrigger.addEventListener('click', () => {
        secretMenu.showModal();
    });

};
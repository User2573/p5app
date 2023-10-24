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
        mesh.position.set(2*i-10+2*rand(),2*j-10+2*rand(),0)
        mesh.material.color.add(new THREE.Color(rand()-.5,rand()-.5,rand()-.5).multiplyScalar(.7));
        group.add(mesh);
    }
}
scene.add(group);

Animator.addCallback((time, dt) => {
    for (const obj of group.children) {
        obj.rotation.x = .2*time * Math.abs(Math.sin(100*obj.position.x));
        obj.rotation.y = .2*time * Math.abs(Math.sin(100*obj.position.y));
    }
})




scene.add(new THREE.AmbientLight(0x202020));
const directionalLight = new THREE.DirectionalLight(0xffffff, .5);
directionalLight.position.set(1,2,3);
scene.add(directionalLight);
const pointLight = new THREE.PointLight(0xffffff, 500);
scene.add(pointLight);

Animator.addCallback(time => {
    pointLight.position.x = 15 * Math.cos(1.9*time);
    pointLight.position.y = 15 * Math.sin(1*time);
    pointLight.position.z = -5;
})
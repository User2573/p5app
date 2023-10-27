

// class Trail {
//     constructor(points, material) {
//         points = [...Array(100).keys()]
//             .map(x => x / 99)
//             .map(t => new THREE.Vector3(t, t, t));
//         this.point = points[0];
//         this.positions = new Float32Array(points.flatMap(p => [p.x, p.y, p.z]));
//         this.mesh = new THREE.Mesh(
//             new THREE.BufferGeometry().setAttribute('position',
//                 new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.StreamDrawUsage)
//             ),
//             material
//         );
//         // this.mesh.geometry.getAttribute('position').needsUpdate = true;
//     }

//     addPoint(point) {
//         this.point = point;
//         this.positions.copyWithin(3, 0, this.positions.length);
//         this.positions[0] = point.x;
//         this.positions[1] = point.y;
//         this.positions[2] = point.z;
//     }
// };

// const axis = new THREE.Vector3(1, 2, 3).normalize();
// const trails = [];
// for (let i = 0; i < 1; i++) {
//     const length = i + 50;
//     const points = Array(length).fill(0).map(() => new THREE.Vector3(
//         Math.cos(7*i),
//         Math.sin(11*i),
//         Math.cos(13*i)
//     ));
//     const trail = new Trail(
//         points,
//         new THREE.LineBasicMaterial({
//             color: 0xffffff,
//             linewidth: 100
//         })
//     );
//     scene.add(trail.mesh);
//     trails.push(trail);
// }
// console.log(trails);



// animator.addCallback((time, dt) => {
//     for (const trail of trails) {
//         const newPoint = trail.point.clone().add(axis.clone().multiplyScalar(dt));
//         trail.addPoint(newPoint);
//     }
// });



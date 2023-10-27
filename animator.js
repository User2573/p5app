import * as THREE from 'three';

export class Animator {
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
}
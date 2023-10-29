import { Clock } from 'three';

export class Animator {
    #clock = new Clock(false);
    #callbacks = [];

    #animate() {
        // dt before time since getElapsedTime resets delta counter
        const dt = this.#clock.getDelta();
        const time = this.#clock.getElapsedTime();
        for (const callback of this.#callbacks) {
            callback(time, dt);
        }

        if (this.#clock.running) {
            requestAnimationFrame(() => this.#animate());
        }
    }

    addCallback(callback) {
        this.#callbacks.push(callback);
    }

    start() {
        this.#clock.start();
        this.#animate();
    }

    stop() {
        this.#clock.stop();
    }
}
import { Clock } from 'three';
import Stats from 'three/addons/libs/stats.module.js'

export class Animator {
    #stats = new Stats();
    #clock = new Clock(false);
    #callbacks = [];

    constructor() {
        this.#stats.dom.id = 'stats';
        document.body.appendChild(this.#stats.dom);
    }

    #animate() {
        this.#stats.begin();
        
        // dt before time since getElapsedTime resets delta counter
        const dt = this.#clock.getDelta();
        const time = this.#clock.getElapsedTime();
        for (const callback of this.#callbacks) {
            callback(time, dt);
        }

        if (this.#clock.running) {
            requestAnimationFrame(() => this.#animate());
        }

        this.#stats.end();
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
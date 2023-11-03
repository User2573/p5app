import { Clock } from 'three';
import Stats from 'three/addons/libs/stats.module.js'

export class Animator {
    #showStats = false;
    #stats = new Stats();
    #clock = new Clock(false);
    #callbacks = [];

    constructor() {
        this.#stats.dom.id = 'stats';
    }

    #animate() {
        if (this.#showStats) {
            this.#stats.begin();
        }
        
        // dt before time since getElapsedTime resets delta counter
        const dt = this.#clock.getDelta();
        const time = this.#clock.getElapsedTime();
        for (const callback of this.#callbacks) {
            callback(time, dt);
        }

        if (this.#clock.running) {
            requestAnimationFrame(() => this.#animate());
        }


        if (this.#showStats) {
            this.#stats.end();
        }
    }

    toggleStats(show = !this.#showStats) {
        this.#showStats = show;
        if (show) {
            document.body.appendChild(this.#stats.dom);
        } else {
            document.body.removeChild(this.#stats.dom);
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
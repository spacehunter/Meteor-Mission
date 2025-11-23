/**
 * Explosion Effect
 * Particle-based explosion animation
 */

import * as THREE from 'three';

export class Explosion {
    constructor(position, particleCount = 20) {
        this.particles = [];
        this.active = true;
        this.createParticles(position, particleCount);
    }

    createParticles(position, count) {
        for (let i = 0; i < count; i++) {
            const geometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 4, 4);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.05, 1, 0.5),
                transparent: true
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(position);

            this.particles.push({
                mesh,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5
                ),
                life: 1
            });
        }
    }

    /**
     * Add explosion to scene
     * @param {THREE.Scene} scene
     */
    addToScene(scene) {
        this.particles.forEach(p => scene.add(p.mesh));
    }

    /**
     * Remove explosion from scene
     * @param {THREE.Scene} scene
     */
    removeFromScene(scene) {
        this.particles.forEach(p => {
            scene.remove(p.mesh);
            p.mesh.geometry.dispose();
            p.mesh.material.dispose();
        });
    }

    /**
     * Update explosion animation
     * @param {number} deltaTime
     * @returns {boolean} True if explosion is still active
     */
    update(deltaTime) {
        if (!this.active) return false;

        let allDead = true;

        for (const particle of this.particles) {
            if (particle.life <= 0) continue;

            allDead = false;

            particle.mesh.position.add(particle.velocity);
            particle.velocity.multiplyScalar(0.95);
            particle.life -= 0.02;
            particle.mesh.material.opacity = particle.life;
            particle.mesh.scale.multiplyScalar(0.98);
        }

        if (allDead) {
            this.active = false;
        }

        return this.active;
    }

    /**
     * Clean up resources
     */
    dispose() {
        this.particles.forEach(p => {
            p.mesh.geometry.dispose();
            p.mesh.material.dispose();
        });
        this.particles = [];
        this.active = false;
    }
}

export default Explosion;

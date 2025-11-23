/**
 * Scene Manager
 * Handles Three.js scene setup and management
 */

import * as THREE from 'three';
import { Config } from '../core/Config.js';

export class SceneManager {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.init();
    }

    /**
     * Initialize Three.js scene, camera, and renderer
     */
    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000510);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 50);
        this.camera.lookAt(0, 0, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Lighting
        this.setupLighting();

        // Starfield
        this.createStarfield();

        // Ground
        this.createGround();

        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    /**
     * Setup scene lighting
     */
    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0x333333);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 20, 10);
        this.scene.add(directionalLight);
    }

    /**
     * Create starfield background
     */
    createStarfield() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(Config.STAR_COUNT * 3);
        const colors = new Float32Array(Config.STAR_COUNT * 3);

        for (let i = 0; i < Config.STAR_COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = -20 - Math.random() * 30;

            const brightness = 0.5 + Math.random() * 0.5;
            colors[i * 3] = brightness;
            colors[i * 3 + 1] = brightness;
            colors[i * 3 + 2] = brightness;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true
        });

        this.starfield = new THREE.Points(geometry, material);
        this.scene.add(this.starfield);
    }

    /**
     * Create ground plane
     */
    createGround() {
        const geometry = new THREE.PlaneGeometry(Config.GAME_WIDTH + 10, 3);
        const material = new THREE.MeshPhongMaterial({
            color: 0x553311,
            emissive: 0x221100
        });

        this.ground = new THREE.Mesh(geometry, material);
        this.ground.position.set(0, -Config.GAME_HEIGHT / 2 - 0.5, 0);
        this.scene.add(this.ground);
    }

    /**
     * Add object to scene
     * @param {THREE.Object3D} object
     */
    add(object) {
        this.scene.add(object);
    }

    /**
     * Remove object from scene
     * @param {THREE.Object3D} object
     */
    remove(object) {
        this.scene.remove(object);
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Render the scene
     */
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Get the Three.js scene
     * @returns {THREE.Scene}
     */
    getScene() {
        return this.scene;
    }

    /**
     * Clean up resources
     */
    dispose() {
        window.removeEventListener('resize', this.onWindowResize);

        if (this.starfield) {
            this.starfield.geometry.dispose();
            this.starfield.material.dispose();
        }

        if (this.ground) {
            this.ground.geometry.dispose();
            this.ground.material.dispose();
        }

        this.renderer.dispose();
    }
}

export default SceneManager;

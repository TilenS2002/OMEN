import { Application } from './base/Application.js';
// import { quat } from './GL_matrix_lib/dist/gl-matrix-module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { Renderer } from './Renderer.js';
import { idle_animation } from './idle_animation.js';
import { FirstPersonController } from './base/FirstPersonController.js';

class App extends Application {

    async start() {

        this.loader2 = new GLTFLoader();
        await this.loader2.load('../3d_models/map/tla_hodnik2.gltf');

        this.loader = new GLTFLoader();
        await this.loader.load('../3d_models/player/MOZIC_res_finish.gltf');

        this.startTime = performance.now();
        this.scene = await this.loader2.loadScene(this.loader.defaultScene);
        this.camera = await this.loader.loadNode('Camera');
        // controller, popravi da bo premikou characterja, ne kamere
        this.controller = new FirstPersonController(this.camera, this.canvas);

        // this.camera.addChild(await this.loader.load('../3d_models/map/mapa_nina.gltf'));

        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }

        // prebam nalozt usak node posebej
        // gltf spec is undefined
        this.prazn = await this.loader.loadNode('Empty');
        this.prazn1 = await this.loader.loadNode('Empty.001');
        this.Droka = await this.loader.loadNode('desna roka');
        this.Lroka = await this.loader.loadNode('leva roka');
        this.Dnoga = await this.loader.loadNode('noga desna');
        this.Lnoga = await this.loader.loadNode('leva noga');
        this.telo = await this.loader.loadNode('telo');
        // gltf spec is undefined
        
        this.renderer = new Renderer(this.gl);
        this.renderer.prepareScene(this.scene);
        this.resize();
        this.update();
    }

    update() {
        this.time = performance.now();
        const time = performance.now() / 1000;
        this.idle = new idle_animation(this.Droka, time);
        this.idle.update();
        this.idle = new idle_animation(this.Lroka, time);
        this.idle.update();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;
        this.controller.update(dt);
    }

    render() {
        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    resize() {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        const aspectRatio = w / h;

        if (this.camera) {
            this.camera.camera.aspect = aspectRatio;
            this.camera.camera.updateMatrix();
        }
    }

}

const canvas = document.getElementById('game');
const app = new App(canvas);
await app.init();
document.querySelector('.loader-container').remove();

import { Application } from './base/Application.js';
// import { quat } from './GL_matrix_lib/dist/gl-matrix-module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { Renderer } from './Renderer.js';
import { idle_animation_LR, idle_animation_DR } from '../3d_models/animacije/idle_animation.js';
import { Dnoga_movement, Droka_movement, Lnoga_movement, Lroka_movement } from '../3d_models/animacije/mozic_animations.js'
import { Physics } from './Physics.js';
import { Krog_rotation } from '../3d_models/animacije/level_animations.js';
// import { FirstPersonController } from './base/FirstPersonController.js';
import { Char_cont } from './base/Char_cont.js';

class App extends Application {

    async start() {

        this.loader2 = new GLTFLoader();
        await this.loader2.load('../3d_models/assets/krog.gltf');

        this.loader = new GLTFLoader();
        await this.loader.load('../3d_models/player/MOZIC_REF_FIX.gltf');

        this.startTime = performance.now();

        this.scene = await this.loader2.loadScene(this.loader.defaultScene);
        this.camera = await this.loader.loadNode('Camera');
        // controller, popravi da bo premikou characterja, ne kamere
        this.telo = await this.loader.loadNode('telo');
        this.controller = new Char_cont(this.telo, this.canvas);
        this.scene.addNode(this.telo);
        this.Physics = new Physics(this.scene);
        // this.camera.addChild(await this.loader.load('../3d_models/map/mapa_nina.gltf'));
        this.krogTest = await this.loader2.loadNode('KROG3');
        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }

        // prebam nalozt usak node posebej
        this.Droka = await this.loader.loadNode('desna_roka');
        this.Lroka = await this.loader.loadNode('leva_roka');
        this.Dnoga = await this.loader.loadNode('noga_desna');
        this.Lnoga = await this.loader.loadNode('leva_noga');
        
        this.idleD = new idle_animation_DR(this.Droka);
        this.idleL = new idle_animation_LR(this.Lroka);
        this.nogaD = new Dnoga_movement(this.Dnoga);
        this.nogaL = new Lnoga_movement(this.Lnoga);
        this.rokaD = new Droka_movement(this.Droka);
        this.rokaL = new Lroka_movement(this.Lroka);

        // test rotacije
        this.krog = new Krog_rotation(this.krogTest, this.krogTest.rotation);

        this.renderer = new Renderer(this.gl);
        this.renderer.prepareScene(this.scene);
        this.resize();
        this.update();
    }

    update() {
        this.time = performance.now();
        const time = performance.now() / 1000;
        this.krog.update(time);
        if (!this.controller.is_moving) {
            this.idleD.update(time);
            this.idleL.update(time);
        }
        else {
            this.nogaD.update(time);
            this.nogaL.update(time);
            this.rokaD.update(time);
            this.rokaL.update(time);
        }
        const dt = (this.time - this.startTime) * 0.005;
        this.startTime = this.time;
        this.controller.update(dt);
        this.Physics.update(dt);
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

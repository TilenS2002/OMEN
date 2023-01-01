import { Application } from './base/Application.js';
import { GLTFLoader } from './GLTFLoader.js';
import { Renderer } from './Renderer.js';
import { idle_animation_LR, idle_animation_DR } from '../3d_models/animacije/idle_animation.js';
import { Dnoga_movement, Droka_movement, jump, Lnoga_movement, Lroka_movement, abilityAinm } from '../3d_models/animacije/mozic_animations.js'
import { Physics } from './Physics.js';
import { Krog_rotation, Platform_movement } from '../3d_models/animacije/level_animations.js';
import { Char_cont } from './base/Char_cont.js';
import { Cam_cont } from './base/Cam_cont.js';

class App extends Application {

    async start() {

        this.loader2 = new GLTFLoader();
        // await this.loader2.load('../3d_models/assets/krog.gltf');
        await this.loader2.load('../3d_models/untitled.gltf');

        this.loader = new GLTFLoader();
        // await this.loader.load('../3d_models/player/MOZIC_REF_FIX.gltf');
        await this.loader.load('../3d_models/player/MOZIC_res_finish.gltf');

        this.startTime = performance.now();

        this.scene = await this.loader2.loadScene(this.loader.defaultScene);
        this.camera = await this.loader.loadNode('Camera');
        // controller, popravi da bo premikou characterja, ne kamere
        // this.prazno = await this.loader.loadNode("Empty.001")
        this.telo = await this.loader.loadNode('telo');
        this.platformTest = await this.loader2.loadNode('Cube');
        this.platform = new Platform_movement(this.platformTest, this.platformTest.rotation);
        this.Droka = await this.loader.loadNode('desna roka');
        this.Lroka = await this.loader.loadNode('leva roka');
        // console.log("Camera: ", this.camera);
        // console.log("Buddy: ", this.telo);
        // console.log("Prazna: ", this.prazno);
        // console.log("Droka: ", this.Droka);
        this.controller = new Char_cont(this.telo, this.canvas, this.platform, this.platform, this.platform, this.platform);
        this.anim = new abilityAinm(this.Lroka, this.Droka);
        this.camCont = new Cam_cont(this.camera, this.canvas, this.controller);
        this.scene.addNode(this.telo);
        
        // this.krogTest = await this.loader2.loadNode('KROG3');
        
        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }

        // prebam nalozt usak node posebej
        // this.Droka = await this.loader.loadNode('desna_roka');
        // this.Lroka = await this.loader.loadNode('leva_roka');
        // this.Dnoga = await this.loader.loadNode('noga_desna');
        // this.Lnoga = await this.loader.loadNode('leva_noga');
        this.Dnoga = await this.loader.loadNode('noga desna');
        this.Lnoga = await this.loader.loadNode('leva noga');
        // this.premik = new Platform_movement(this.platforma, this.platforma.rotation);

        this.footsteps = new Audio('../audio/footsteps/concrete-footsteps-6752.mp3');
        this.footsteps.volume = 0.3;
        this.ambience = new Audio('../audio/ambient/the-cradle-113847.mp3');
        this.ambience.volume = 0.14;
        this.idleD = new idle_animation_DR(this.Droka);
        this.idleL = new idle_animation_LR(this.Lroka);
        this.nogaD = new Dnoga_movement(this.Dnoga);
        this.nogaL = new Lnoga_movement(this.Lnoga);
        this.rokaD = new Droka_movement(this.Droka);
        this.rokaL = new Lroka_movement(this.Lroka);
        // this.skok = new jump(this.Lroka);
        this.Physics = new Physics(this.scene, this.telo, this.Dnoga, this.Droka, this.Lnoga, this.Lroka, this.camera);
        // this.win = browser.windows.get()
        // test rotacije
        // this.krog = new Krog_rotation(this.krogTest, this.krogTest.rotation);
        
        
        this.renderer = new Renderer(this.gl);
        this.renderer.prepareScene(this.scene);
        this.resize();
        this.update();
    }

    isPlaying(audio) {
        return !audio.paused;
    }

    update() {
        this.time = performance.now();
        const time = performance.now() / 1000;
        if (!this.isPlaying(this.ambience))
            this.ambience.play();
        // this.krog.update(time);
        // this.krog.popravek=false;
        this.platform.update(time);
        if (!this.controller.is_moving) {
            this.idleD.update(time);
            this.idleL.update(time);
            // this.skok.update(time);
            this.footsteps.pause();
        }
        else {
            this.nogaD.update(time);
            this.nogaL.update(time);
            this.rokaD.update(time);
            this.rokaL.update(time);
            this.footsteps.play();
        }
        const dt = (this.time - this.startTime) * 0.005;
        this.startTime = this.time;
        if (this.controller.abilityUsed) {
            this.anim.update(time);
        }
        this.controller.update(dt);
        this.camCont.update(dt);
        this.Physics.update(dt);
        console.log(time);
        // console.log(this.telo.velocity);
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

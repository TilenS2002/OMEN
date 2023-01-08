import { Application } from './base/Application.js';
import { GLTFLoader } from './GLTFLoader.js';
import { Renderer } from './Renderer.js';
import { idle_animation_LR, idle_animation_DR } from '../3d_models/animacije/idle_animation.js';
import { Dnoga_movement, Droka_movement, Lnoga_movement, Lroka_movement, abilityAinm } from '../3d_models/animacije/mozic_animations.js'
import { Physics } from './Physics.js';
import { Krog_rotation, Platform_movement, Ability_movement } from '../3d_models/animacije/level_animations.js';
import { Char_cont } from './base/Char_cont.js';
import { vec3 } from './GL_matrix_lib/dist/gl-matrix-module.js';

class App extends Application {

    async start() {

        this.loader2 = new GLTFLoader();
        await this.loader2.load('../3d_models/map/mapa_test_MANSE.gltf');
        
        this.loader = new GLTFLoader();
        await this.loader.load('../3d_models/player/MOZIC.gltf');

        this.startTime = performance.now();

        this.scene = await this.loader2.loadScene(this.loader.defaultScene);
        this.camera = await this.loader.loadNode('Camera');
        this.telo = await this.loader.loadNode('telo');
        this.box = await this.loader.loadNode('collajd');
        this.box.mesh = this.box.mesh.opacity = 0;
        this.ubijalska = await this.loader2.loadNode('ubijalska_povrsina_velika');
        
        this.platformaStart = await this.loader2.loadNode('platform1.003');
        this.platTest = new Platform_movement(this.platformaStart);
        this.platforma1 = await this.loader2.loadNode('platform1.008');
        this.plat1 = new Platform_movement(this.platforma1);
        this.platforma3 = await this.loader2.loadNode('platform1.066');
        this.plat3 = new Platform_movement(this.platforma3);
        this.platforma4 = await this.loader2.loadNode('platform1.065');
        this.plat4 = new Platform_movement(this.platforma4);
        this.Droka = await this.loader.loadNode('desna_roka');
        this.Lroka = await this.loader.loadNode('leva_roka');
        this.Dnoga = await this.loader.loadNode('noga_desna');
        this.Lnoga = await this.loader.loadNode('leva_noga');
        this.spawn = await this.loader2.loadNode('spawnpoint');
        this.camSP = await this.loader2.loadNode('camspawn');

        this.telo.translation = this.spawn.translation;
        this.camera.translation = this.camSP.translation;
        this.char = [this.telo, this.Dnoga, this.Lnoga, this.Droka, this.Lroka];
        
        this.anim = new abilityAinm(this.Lroka, this.Droka);
        this.scene.addNode(this.telo);
        
        this.krogTest = await this.loader2.loadNode('KROG3.017');
        
        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }

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

        this.hid = [];
        this.collide = [];
        this.scene.traverse(node => {
            if (node.extras && node.extras.hidden) {
                node.mesh = node.mesh.opacity = 0;
                this.hid.push(node);
            }
            if (node.extras && node.extras.collidable && !this.char.includes(node)) {
                this.collide.push(node);
            }
        });
        this.collide.push(this.ubijalska);
        this.Physics = new Physics(this.scene, this.telo, this.box, this.Dnoga, this.Droka, this.Lnoga, this.Lroka, this.camera, this.collide, this.spawn, this.camSP);
        this.krog = new Krog_rotation(this.krogTest, this.krogTest.rotation);
        
        this.wada = await this.loader2.loadNode('platform1.056');
        this.wagn = await this.loader2.loadNode('platform1.005');
        this.narava = await this.loader2.loadNode('platform1.001');
        this.erf = await this.loader2.loadNode('platform1.013');
        this.controller = new Char_cont(this.telo, this.camera, this.canvas, this.distanca, this.wada, this.wagn, this.narava, this.erf);
        
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
        this.krog.update(time);
        this.platTest.update(0,0,0.05*Math.sin(time));
        this.plat1.update(0.08*Math.sin(time), 0, 0);
        this.plat3.update(0.1*Math.sin(time), 0, 0);
        this.plat4.update(-0.02*Math.sin((time)), 0, 0);
        if (!this.controller.is_moving) {
            this.idleD.update(time);
            this.idleL.update(time);
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
        // if (this.controller.abilityUsed) {
        //     this.anim.start();
        //     this.anim.update(time);
        // }
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

import { Application } from './base/Application.js';

import { GLTFLoader } from './GLTFLoader.js';
import { Renderer } from './Renderer.js';

class App extends Application {

    async start() {
        this.loader = new GLTFLoader();
        await this.loader.load('../3d_models/player/MOZIC_res_finish.gltf');

        this.scene = await this.loader.loadScene(this.loader.defaultScene);
        this.camera = await this.loader.loadNode('Camera_Orientation');

        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }

        this.renderer = new Renderer(this.gl);
        this.renderer.prepareScene(this.scene);
        this.resize();
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

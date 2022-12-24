import {quat} from './GL_matrix_lib/dist/gl-matrix-module.js';

export class idle_animation {
    constructor(node, time) {
        this.node = node;
        this.time = time;
    }
    update() {
        const idle = quat.setAxisAngle(quat.create(), [1,0,0], Math.sin(this.time * 2)*0.4);
        // this.node.idle = idle;
        this.node.idle = quat.clone(idle);
        console.log("updatan");
    }
}
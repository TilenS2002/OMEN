import {quat} from './GL_matrix_lib/dist/gl-matrix-module.js';

export class idle_animation {
    constructor(node) {
        this.node = node;
    }
    update(time) {
        const idle = quat.setAxisAngle(quat.create(), [1,0,0], Math.sin(time * 2)*0.4);
        // this.node.idle = idle;
        // this.node.idle = quat.clone(idle);
        this.node.rotation = idle;
        // console.log("updatan");
    }
}
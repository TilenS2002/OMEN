import {quat} from '../../engine/GL_matrix_lib/dist/gl-matrix-module.js';

export class idle_animation_LR {
    constructor(node) {
        this.node = node;
    }
    update(time) {
        let idle = quat.setAxisAngle(quat.create(), [0.2,0,0], Math.sin(time*2)*0.2);
        this.node.rotation = idle;
    }
}

export class idle_animation_DR {
    constructor(node) {
        this.node = node;
    }
    update(time) {
        let idle = quat.setAxisAngle(quat.create(), [-0.2,0,0], Math.sin(time*2)*0.2);
        this.node.rotation = idle;
    }
}
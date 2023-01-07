import {quat, vec3} from '../../engine/GL_matrix_lib/dist/gl-matrix-module.js';

export class Krog_rotation {
    constructor(node, rotacija) {
        this.node = node;
        this.popravek = rotacija;
    }
    update(time) {
        let rotacija = quat.setAxisAngle(quat.create(), [1,0,0], Math.sin(time*0.01)*10);
        this.node.rotacija = quat.multiply(quat.create(), rotacija,this.popravek);
    }
}

export class Platform_movement {
    constructor(node) {
        this.node = node;
    }
    update(x, y, z) {
        this.node.translation = quat.add(this.node.translation, this.node.translation, quat.fromEuler(quat.create(), x, y, z));
    }
}
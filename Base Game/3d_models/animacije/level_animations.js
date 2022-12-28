import {quat} from '../../engine/GL_matrix_lib/dist/gl-matrix-module.js';

export class Krog_rotation {
    constructor(node) {
        this.node = node;
    }
    update(time) {
        let rotacija = quat.setAxisAngle(quat.create(), [0,1,0], Math.sin(time*0.1)*10);
        this.node.rotation = rotacija;
        // console.log("updatan");
    }
}
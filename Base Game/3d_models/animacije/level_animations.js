import {quat} from '../../engine/GL_matrix_lib/dist/gl-matrix-module.js';

export class Krog_rotation {
    constructor(node) {
        this.node = node;
        this.popravek = node.rotation;
    }
    update(time) {
        let rotacija = quat.setAxisAngle(quat.create(), [1,0,0], Math.sin(time*0.1)*10);
        this.node.rotation = quat.multiply(quat.create(), rotacija,this.popravek);
        // console.log("updatan");
    }
}
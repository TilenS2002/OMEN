import {quat} from '../../engine/GL_matrix_lib/dist/gl-matrix-module.js';

export class Krog_rotation {
    constructor(node, rotacija) {
        this.node = node;
        this.popravek = rotacija;
    }
    update(time) {
        let rotacija = quat.setAxisAngle(quat.create(), [1,0,0], Math.sin(time*0.01)*10);
        this.node.rotation = quat.multiply(quat.create(), rotacija,this.popravek);
        // console.log("updatan");
    }
}

export class Platform_movement {
    constructor(node, rotacija) {
        this.node = node;
        this.popravek = rotacija;
        this.premik = false;
    }
    update(time) {
        if (this.premik) {
            let premik = quat.setAxisAngle(quat.create(), [10,0,0], Math.sin(time));
            this.node.translation = quat.multiply(quat.create(), premik,this.popravek);
        }
    }
    setPremik(bool) {
        this.premik = bool;
    }
}
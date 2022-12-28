import {quat} from '../../engine/GL_matrix_lib/dist/gl-matrix-module.js';

export class Dnoga_movement {
    constructor(node) {
        this.node = node;
    }
    update(time) {
        let idle = quat.setAxisAngle(quat.create(), [0,0,0.5], Math.sin(time*8)*0.4);
        this.node.rotation = idle;
        // console.log("updatan");
    }
}

export class Lnoga_movement {
    constructor(node) {
        this.node = node;
    }
    update(time) {
        let idle = quat.setAxisAngle(quat.create(), [0,0,-0.5], Math.sin(time*8)*0.4);
        this.node.rotation = idle;
        // console.log("updatan");
    }
}

export class Droka_movement {
    constructor(node) {
        this.node = node;
    }
    update(time) {
        let idle = quat.setAxisAngle(quat.create(), [0,0,-0.5], Math.sin(time*8)*0.4);
        this.node.rotation = idle;
        // console.log("updatan");
    }
}

export class Lroka_movement {
    constructor(node) {
        this.node = node;
    }
    update(time) {
        let idle = quat.setAxisAngle(quat.create(), [0,0,0.5], Math.sin(time*8)*0.4);
        this.node.rotation = idle;
        // console.log("updatan");
    }
}
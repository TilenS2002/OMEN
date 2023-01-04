import {quat} from '../../engine/GL_matrix_lib/dist/gl-matrix-module.js';

export class Dnoga_movement {
    constructor(node) {
        this.node = node;
    }
    update(time) {
        let moveDN = quat.setAxisAngle(quat.create(), [0,0,0.5], Math.sin(time*8)*0.4);
        this.node.rotation = moveDN;
        // console.log("updatan");
    }
}

export class Lnoga_movement {
    constructor(node) {
        this.node = node;
    }
    update(time) {
        let moveLN = quat.setAxisAngle(quat.create(), [0,0,-0.5], Math.sin(time*8)*0.4);
        this.node.rotation = moveLN;
        // console.log("updatan");
    }
}

export class Droka_movement {
    constructor(node) {
        this.node = node;
    }
    update(time) {
        let moveDR = quat.setAxisAngle(quat.create(), [0,0,-0.5], Math.sin(time*8)*0.4);
        this.node.rotation = moveDR;
        // console.log("updatan");
    }
}

export class Lroka_movement {
    constructor(node) {
        this.node = node;
    }
    update(time) {
        let moveLR = quat.setAxisAngle(quat.create(), [0,0,0.5], Math.sin(time*8)*0.4);
        this.node.rotation = moveLR;
        // console.log("updatan");
    }
}

export class jump {
    constructor(node) {
        this.node = node;
    }
    update() {
        let jump = quat.setAxisAngle(quat.create(), [1,0,0], Math.sin(1)*0.4);
        this.node.rotate = jump;
        // console.log("updatan");
    }
}

export class abilityAinm {
    constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
        this.start;
        this.isRunning = false;
    }
    update(time) {
        if (!this.isRunning) {
            return;
        }
        let move = quat.setAxisAngle(quat.create(), [0,0,1], Math.sin(time-this.start*2)*0.99);
        this.node1.rotation = move;
        this.node2.rotation = move;
        
    }
    start() {
        this.start = performance.now();
    }
}
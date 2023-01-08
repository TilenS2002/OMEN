import {quat, vec3} from '../../engine/GL_matrix_lib/dist/gl-matrix-module.js';

export class Krog_rotation {
    constructor(node) {
        this.node = node;
        // this.popravek = rotacija;
    }
    update(time) {
        let rotacija = quat.setAxisAngle(quat.create(), [10,0,0], Math.sin(time)*10);
        // this.node.rotacija = quat.multiply(quat.create(), rotacija,this.popravek);
        this.node.rotacija = rotacija
    }
}

export class Platform_movement {
    constructor(node) {
        this.node = node;
    }
    update(x, y, z) {
        this.node.translation = vec3.add(this.node.translation, this.node.translation, vec3.fromValues(x, y, z));
    }
}

export class Ability_movement {
    constructor(node) {
        this.node = node;
        this.bool = false;
    }
    update(x, y, z) {
        if (!this.bool)
            this.node.translation = vec3.add(this.node.translation, this.node.translation, vec3.fromValues(x, y, z));
    }
    setPremik(bool) {
        this.bool = bool;
    }
}

export class Ability_rotate {
    constructor(node) {
        this.node = node;
        this.bool = false;
    }
    update() {
        const rotation = quat.create();
        quat.rotateY(rotation, rotation, Math.PI/2);
        this.node.rotation = rotation;
            // this.node.rotation = quat.setAxisAngle(quat.create(), [x,y,z], Math.sin(time));
    }
    setPremik(bool) {
        this.bool = bool;
    }
}


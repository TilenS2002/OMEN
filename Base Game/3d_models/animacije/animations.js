export class Dnoga_movement {
    constructor(node) {
        this.node = node;
    }
    update(time) {
        let idle = quat.setAxisAngle(quat.create(), [0,0,0.5], Math.sin(time*6)*0.2);
        this.node.rotation = idle;
        // console.log("updatan");
    }
}

export class Lnoga_movement {
    constructor(node) {
        this.node = node;
    }
    update(time) {
        let idle = quat.setAxisAngle(quat.create(), [0,0,-0.5], Math.sin(time*6)*0.2);
        this.node.rotation = idle;
        // console.log("updatan");
    }
}
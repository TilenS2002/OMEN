import { quat, vec3, mat4 } from '../GL_matrix_lib/dist/gl-matrix-module.js';

// import { Utils } from '../Utils.js';
// import { Node } from './Node.js';

// export class Char_cont extends Node {

//     constructor(options) {
//         super(options);
//         Utils.init(this, this.constructor.defaults, options);

//         this.projection = mat4.create();
//         this.updateProjection();

//         this.pointermoveHandler = this.pointermoveHandler.bind(this);
//         this.keydownHandler = this.keydownHandler.bind(this);
//         this.keyupHandler = this.keyupHandler.bind(this);
//         this.keys = {};
//     }

//     updateProjection() {
//         mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);
//     }

//     update(dt) {
//         const c = this;

//         const forward = vec3.set(vec3.create(),
//             -Math.sin(c.rotation[1]), 0, -Math.cos(c.rotation[1]));
//         const right = vec3.set(vec3.create(),
//             Math.cos(c.rotation[1]), 0, -Math.sin(c.rotation[1]));

//         // 1: add movement acceleration
//         const acc = vec3.create();
//         if (this.keys['KeyW']) {
//             vec3.add(acc, acc, forward);
//         }
//         if (this.keys['KeyS']) {
//             vec3.sub(acc, acc, forward);
//         }
//         if (this.keys['KeyD']) {
//             vec3.add(acc, acc, right);
//         }
//         if (this.keys['KeyA']) {
//             vec3.sub(acc, acc, right);
//         }

//         // 2: update velocity
//         vec3.scaleAndAdd(c.velocity, c.velocity, acc, dt * c.acceleration);

//         // 3: if no movement, apply friction
//         if (!this.keys['KeyW'] &&
//             !this.keys['KeyS'] &&
//             !this.keys['KeyD'] &&
//             !this.keys['KeyA'])
//         {
//             vec3.scale(c.velocity, c.velocity, 1 - c.friction);
//         }

//         // 4: limit speed
//         const len = vec3.len(c.velocity);
//         if (len > c.maxSpeed) {
//             vec3.scale(c.velocity, c.velocity, c.maxSpeed / len);
//         }
//     }

//     enable() {
//         document.addEventListener('pointermove', this.pointermoveHandler);
//         document.addEventListener('keydown', this.keydownHandler);
//         document.addEventListener('keyup', this.keyupHandler);
//     }

//     disable() {
//         document.removeEventListener('pointermove', this.pointermoveHandler);
//         document.removeEventListener('keydown', this.keydownHandler);
//         document.removeEventListener('keyup', this.keyupHandler);

//         for (const key in this.keys) {
//             this.keys[key] = false;
//         }
//     }

//     pointermoveHandler(e) {
//         const dx = e.movementX;
//         const dy = e.movementY;
//         const c = this;

//         c.rotation[0] -= dy * c.pointerSensitivity;
//         c.rotation[1] -= dx * c.pointerSensitivity;

//         const pi = Math.PI;
//         const twopi = pi * 2;
//         const halfpi = pi / 2;

//         if (c.rotation[0] > halfpi) {
//             c.rotation[0] = halfpi;
//         }
//         if (c.rotation[0] < -halfpi) {
//             c.rotation[0] = -halfpi;
//         }

//         c.rotation[1] = ((c.rotation[1] % twopi) + twopi) % twopi;
//     }

//     keydownHandler(e) {
//         this.keys[e.code] = true;
//     }

//     keyupHandler(e) {
//         this.keys[e.code] = false;
//     }

// }

// Char_cont.defaults = {
//     aspect           : 1,
//     fov              : 1.5,
//     near             : 0.01,
//     far              : 100,
//     velocity         : [0, 0, 0],
//     pointerSensitivity : 0.002,
//     maxSpeed         : 3,
//     friction         : 0.2,
//     acceleration     : 20
// };


export class Char_cont {

    constructor(node, domElement) {
        this.node = node;
        this.domElement = domElement;

        this.keys = {};

        // za ločeno kamero
        // loči kamero in characterja
        // programsko nastavi lokacijo kamere glede na lokacijo characterja
        // global matrix
        
        this.pitch = 0;
        this.yaw = 0;

        this.velocity2 = [0, 0, 0];
        this.acceleration = 5;
        this.maxSpeed = 10;
        this.decay = 0.99;
        this.pointerSensitivity = 0.002;
        this.is_moving = false;
        this.jump = false;
        
        this.initHandlers();
    }

    initHandlers() {
        this.pointermoveHandler = this.pointermoveHandler.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);

        const element = this.domElement;
        const doc = element.ownerDocument;

        doc.addEventListener('keydown', this.keydownHandler);
        doc.addEventListener('keyup', this.keyupHandler);

        element.addEventListener('click', e => element.requestPointerLock());
        doc.addEventListener('pointerlockchange', e => {
            if (doc.pointerLockElement === element) {
                doc.addEventListener('pointermove', this.pointermoveHandler);
            } else {
                doc.removeEventListener('pointermove', this.pointermoveHandler);
            }
        });
        
    }

    update(dt) {
        // Calculate forward and right vectors.
        const cos = Math.cos(this.yaw);
        const sin = Math.sin(this.yaw);
        const right = [-sin, 0, -cos];
        const forward = [cos, 0, -sin];
        const up = [0,1,0];

        // Map user input to the acceleration vector.
        const acc = vec3.create();
        // console.log(this.keys);
        if (this.keys['KeyW']) {
            vec3.add(acc, acc, forward);
            this.is_moving = true;
        }
        if (this.keys['KeyS']) {
            vec3.sub(acc, acc, forward);
            this.is_moving = true;
        }
        if (this.keys['KeyD']) {
            vec3.sub(acc, acc, right);
            this.is_moving = true;
        }
        if (this.keys['KeyA']) {
            vec3.add(acc, acc, right);
            this.is_moving = true;
        }
        if (this.keys['Space']) {
            vec3.add(acc, acc, up);
            this.jump = true;
            // console.log("skace");
        }
        if (this.jump) {
            vec3.sub(acc, acc, up);
            this.jump = false;
        }

        // Update velocity based on acceleration.
        vec3.scaleAndAdd(this.velocity2, this.velocity2, acc, dt * this.acceleration);

        // If there is no user input, apply decay.
        if (!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA'])
        {
            const decay = Math.exp(dt * Math.log(1 - this.decay));
            vec3.scale(this.velocity2, this.velocity2, decay);
            this.is_moving = false;
        }

        // Limit speed to prevent accelerating to infinity and beyond.
        const speed = vec3.length(this.velocity2);
        if (speed > this.maxSpeed) {
            vec3.scale(this.velocity2, this.velocity2, this.maxSpeed / speed);
        }

        // Update translation based on velocity.
        this.node.translation = vec3.scaleAndAdd(vec3.create(),
            this.node.translation, this.velocity2, dt);

        // Update rotation based on the Euler angles.
        const rotation = quat.create();
        quat.rotateY(rotation, rotation, this.yaw);
        quat.rotateX(rotation, rotation, 0);
        this.node.rotation = rotation;
        // console.log("pitch: ",this.pitch, "yaw: ",this.yaw)
        this.node.velocitySet(this.velocity2);
    }

    // enable() {
    //     document.addEventListener('pointermove', this.pointermoveHandler);
    //     document.addEventListener('keydown', this.keydownHandler);
    //     document.addEventListener('keyup', this.keyupHandler);
    // }

    // disable() {
    //     document.removeEventListener('pointermove', this.pointermoveHandler);
    //     document.removeEventListener('keydown', this.keydownHandler);
    //     document.removeEventListener('keyup', this.keyupHandler);

    //     for (const key in this.keys) {
    //         this.keys[key] = false;
    //     }
    // }

    pointermoveHandler(e) {
        const dx = e.movementX;
        const dy = e.movementY;
        this.pitch -= dy * this.pointerSensitivity;
        this.yaw   -= dx * this.pointerSensitivity;

        const pi = Math.PI;
        const twopi = pi * 2;
        const halfpi = pi / 2;

        // Limit pitch so that the camera does not invert on itself.
        if (this.pitch > halfpi) {
            this.pitch = halfpi;
        }
        if (this.pitch < -halfpi) {
            this.pitch = -halfpi;
        }

        // Constrain yaw to the range [0, pi * 2]
        this.yaw = ((this.yaw % twopi) + twopi) % twopi;
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }

    is_moving() {
        return this.is_moving;
    }

    getCharRotation() {
        return [this.yaw, this.pitch];
    }

    // lahko probam pobrat char velocity, speed, decay in pointer sensitivity, pol pa acc prlagodim v datoteki tulk da bo micknu zamika zad za characterjem



}

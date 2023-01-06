import { quat, vec3, mat4 } from '../GL_matrix_lib/dist/gl-matrix-module.js';


export class Cam_cont {

    constructor(node, domElement, char) {
        this.node = node;
        this.domElement = domElement;
        this.char = char;
        this.connected = char.getConnected();
        this.keys = {};

        this.pitch = this.char.getCharRotation()[1];
        this.yaw = this.char.getCharRotation()[0];

        this.buttons = this.char.getButtonValues() || {};

        this.velocity = [0, 0, 0];
        this.acceleration = 5;
        this.maxSpeed = 5;
        this.decay = 0.99;
        this.pointerSensitivity = char.getPS();

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

        window.addEventListener('gamepadconnected', (e) => {
            this.connected = !this.connected;
            // this.gamepads.connect(e);
            if (this.connected)
                this.pointerSensitivity = 0.2;
        });
        window.addEventListener("gamepaddisconnected", (e) => {
            this.connected = !this.connected;
            // this.gamepads.disconnect();
            if (!this.connected)
                this.pointerSensitivity = 0.002;
          });

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
        // console.log("prejel char cont rot: ", this.pitch, " ", this.yaw);
        this.buttons = this.char.getButtonValues();
        // console.log(this.buttons)
        // let cos = Math.cos(0);
        // let sin = Math.sin(0);
        // if (this.connected) {
        //     cos = Math.cos(((this.axes[2] % Math.PI*2) + Math.PI*2) % Math.PI*2);
        //     sin = Math.sin(((this.axes[2] % Math.PI*2) + Math.PI*2) % Math.PI*2);
        // }
        // else {
        //     cos = Math.cos(this.yaw);
        //     sin = Math.sin(this.yaw);
        // }
        // const right = [-sin, 0, -cos];
        // const forward = [cos, 0, -sin];

        // Map user input to the acceleration vector.
        let acc = vec3.create();
        if (this.keys['KeyW'] || (this.connected && this.buttons == 'DPad-Up')) {
            // vec3.add(acc, acc, forward);
            acc = this.char.getCam()[0];
        }
        if (this.keys['KeyS'] || (this.connected && this.buttons == 'DPad-Down')) {
            // vec3.sub(acc, acc, forward);
            acc = this.char.getCam()[1];
        }
        if (this.keys['KeyD'] || (this.connected && this.buttons == 'DPad-Left')) {
            // vec3.sub(acc, acc, right);
            acc = this.char.getCam()[2];
        }
        if (this.keys['KeyA'] || (this.connected && this.buttons == 'DPad-Right')) {
            // vec3.add(acc, acc, right);
            acc = this.char.getCam()[3];
        }

        // Update velocity based on acceleration.
        vec3.scaleAndAdd(this.velocity, this.velocity, acc, dt * this.acceleration);

        // If there is no user input, apply decay.
        if (this.connected) {
            if (!this.buttons == 'DPad-Up' && 
                !this.buttons == 'DPad-Down' && 
                !this.buttons == 'DPad-Left' &&
                !this.buttons == 'DPad-Right')
            {
                const decay = Math.exp(dt * Math.log(1 - this.decay));
                vec3.scale(this.velocity, this.velocity, decay);
            }
        }
        else {
            if ((!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA']))
            {
                const decay = Math.exp(dt * Math.log(1 - this.decay));
                vec3.scale(this.velocity, this.velocity, decay);
            }
        }

        // Limit speed to prevent accelerating to infinity and beyond.
        const speed = vec3.length(this.velocity);
        if (speed > this.maxSpeed) {
            vec3.scale(this.velocity, this.velocity, this.maxSpeed / speed);
        }

        // Update translation based on velocity.
        this.node.translation = vec3.scaleAndAdd(vec3.create(),
            this.node.translation, this.velocity, dt);
    }

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

}

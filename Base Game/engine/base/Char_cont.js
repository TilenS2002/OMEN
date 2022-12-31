import { quat, vec3, mat4 } from '../GL_matrix_lib/dist/gl-matrix-module.js';

import { abilities } from '../abilities.js';

export class Char_cont {

    constructor(node, domElement, obj1, obj2, obj3, obj4) {
        this.node = node;
        this.domElement = domElement;
        this.axesRotation = 0;
        this.keys = {};
        this.connected = false;
        this.is_moving = false;
        this.gamepads = {
            controller: {},
            connect(e) {
                this.controller = e.gamepad;
                console.log("Connected")
            },
            disconnect() {
                delete this.controller;
                console.log('Disconnected');
            },
            update() {
                this.buttonsCache = [];
                for (let index = 0; index < this.buttonsStatus.length; index++) {
                    this.buttonsCache[index] = this.buttonsStatus[index];
                }
                this.buttonsStatus = [];
                const cont = this.controller || {};
                const sitsnjen = [];
                if (cont.buttons) {
                    for (let gumbi = 0; gumbi < cont.buttons.length; gumbi++) {
                        if (cont.buttons[gumbi].pressed) {
                            sitsnjen.push(this.buttons[gumbi]);
                        }
                    }
                }
                const axes = [];
                if (cont.axes) {
                    for (let ax = 0; ax < cont.axes.length; ax++) {
                        axes.push(cont.axes[ax]);
                    }
                }
                this.axesStatus = axes;
                this.buttonsStatus = sitsnjen;
                return sitsnjen;
            },
            buttonPressed(gumb, pridrzan) {
                let newPress = false;
                for (let index = 0; index < this.buttonsStatus.length; index++) {
                    if (this.buttonsStatus[index] === gumb) {
                        newPress = true;
                        if (!pridrzan) {
                            for (let cache = 0; cache < this.buttonsCache.length; cache++) {
                                newPress = (this.buttonsCache[cache] !== gumb);
                            }
                        }
                    }
                }
                return newPress;
            },
           buttons: [
                'A','B','X','Y','LB','RB','LT','RT','Power','Start','Axis-Left',
                'Axis-Right','DPad-Up','DPad-Down','DPad-Left','DPad-Right'
            ],
            buttonsCache: [],
            buttonsStatus: [],
            axesStatus: []
        }
        
        this.obj1 = obj1;
        this.obj2 = obj2;
        this.obj3 = obj3;
        this.obj4 = obj4;
        
        this.pitch = 0;
        this.yaw = 0;

        this.velocity2 = [0, 0, 0];
        this.acceleration = 5;
        this.maxSpeed = 10;
        this.decay = 0.99;
        this.pointerSensitivity = 0.002;
        this.ability = new abilities();
        this.pritisk = [false, false, false, false, false];
        
        this.initHandlers();
    }

    initHandlers() {
        
        this.pointermoveHandler = this.pointermoveHandler.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
        this.keypressedHandler = this.keypressedHandler.bind(this);

        const element = this.domElement;
        const doc = element.ownerDocument;

        doc.addEventListener('keydown', this.keydownHandler);
        doc.addEventListener('keyup', this.keyupHandler);
        doc.addEventListener('keypress', this.keypressedHandler);
        element.addEventListener('gamepadconnected', this.gamepadHandler);

        window.addEventListener('gamepadconnected', (e) => {
            this.connected = !this.connected;
            this.gamepads.connect(e);
            if (this.connected)
                this.pointerSensitivity = 0.2;
        });
        window.addEventListener("gamepaddisconnected", (e) => {
            this.connected = !this.connected;
              this.gamepads.disconnect();
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
        const cos = Math.cos(this.yaw);
        const sin = Math.sin(this.yaw);
        const right = [-sin, 0, -cos];
        const forward = [cos, 0, -sin];
        // const up = [0,1,0];
        if (this.connected) {
            this.gamepads.update();
            // console.log(this.gamepads.axesStatus)
            // console.log(this.is_moving)
        }
        else
            console.log("waiting for input")

        // Map user input to the acceleration vector.
        const acc = vec3.create();
        if (this.keys['KeyW'] || (this.connected && this.gamepads.axesStatus[1] < -0.08)) {
            vec3.add(acc, acc, forward);
            // console.log(this.is_moving);
            this.is_moving = true;
            // console.log(this.is_moving);
        }
        if (this.keys['KeyS'] || (this.connected && this.gamepads.axesStatus[1] > 0.08)) {
            vec3.sub(acc, acc, forward);
            this.is_moving = true;
        }
        if (this.keys['KeyD'] || (this.connected && this.gamepads.axesStatus[0] > 0.08)) {
            vec3.sub(acc, acc, right);
            this.is_moving = true;
        }
        if (this.keys['KeyA'] || (this.connected && this.gamepads.axesStatus[0] < -0.08)) {
            vec3.add(acc, acc, right);
            this.is_moving = true;
        }
        if (this.gamepads.buttonPressed('A')) {
            this.pritisk[0] = !this.pritisk[0];
            this.ability.water(this.obj1, this.pritisk[0]);
        }
        if (this.gamepads.buttonPressed('B')) {
            this.pritisk[1] = !this.pritisk[1];
            this.ability.earth(this.obj2, this.pritisk[1]);
        }
        if (this.gamepads.buttonPressed('X')) {
            this.pritisk[2] = !this.pritisk[2];
            this.ability.fire(this.obj3, this.pritisk[2]);
        }
        if (this.gamepads.buttonPressed('Y')) {
            this.pritisk[3] = !this.pritisk[3];
            this.ability.stone(this.obj1, this.pritisk[3]);
        }
        
        // Update velocity based on acceleration.
        vec3.scaleAndAdd(this.velocity2, this.velocity2, acc, dt * this.acceleration);

        // If there is no user input, apply decay.
        if ((!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA']) || (
            (!this.gamepads.axesStatus[1] < -0.08) && 
            (!this.gamepads.axesStatus[1] > 0.08) && 
            (!this.gamepads.axesStatus[0] < -0.08) &&
            (!this.gamepads.axesStatus[0] > 0.08)))
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
        if (this.connected) {
            let compu = this.gamepads.axesStatus[2];
            if (this.gamepads.axesStatus[2] > 0.09 || this.gamepads.axesStatus[2] < -0.09) {
                this.axesRotation += compu;
            }
            else {
                this.axesRotation -= compu;
            }
            quat.rotateY(rotation, rotation, this.axesRotation*this.pointerSensitivity);
            quat.rotateX(rotation, rotation, 0);
        }
        else {
            quat.rotateY(rotation, rotation, this.yaw);
            quat.rotateX(rotation, rotation, 0);
        }
        this.node.rotation = rotation;
        // console.log("pitch: ",this.pitch, "yaw: ",this.yaw)
        this.node.velocitySet(this.velocity2);
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

    keypressedHandler() {
        if (this.keys['Digit1']) {
            this.pritisk[0] = !this.pritisk[0];
            this.ability.water(this.obj1, this.pritisk[0]);
            this.keys['Digit1'] = this.pritisk[0];
        }
        else if (this.keys['Digit2']) {
            this.pritisk[1] = !this.pritisk[1];
            this.ability.earth(this.obj2, this.pritisk[1]);
            this.keys['Digit2'] = this.pritisk[1];
        }
        else if (this.keys['Digit3']) {
            this.pritisk[2] = !this.pritisk[2];
            this.ability.fire(this.obj3, this.pritisk[2]);
            this.keys['Digit3'] = this.pritisk[2];
        }
        else if (this.keys['Digit4']) {
            this.pritisk[3] = !this.pritisk[3];
            this.ability.stone(this.obj4, this.pritisk[3]);
            this.keys['Digit4'] = this.pritisk[3];
        }
        else if (this.keys['Space']) {
            this.pritisk[4] = !this.pritisk[4];
            this.ability.stone(this.obj1, this.pritisk[4]);
            this.keys['Space'] = this.pritisk[4];
        } 
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

    getPS() {
        return this.pointerSensitivity;
    }

    getV3() {
        return
    }

    // lahko probam pobrat char velocity, speed, decay in pointer sensitivity, pol pa acc prlagodim v datoteki tulk da bo micknu zamika zad za characterjem



}

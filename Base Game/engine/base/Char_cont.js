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
        this.maxSpeed = 5;
        this.decay = 0.99;
        this.pointerSensitivity = 0.002;
        this.ability = new abilities();
        this.pritisk = [false, false, false, false, false];

        this.Wsfx = new Audio('../audio/abilities/water/mixkit-heal-soft-water-spell-878.wav');
        this.Nsfx = new Audio('../audio/abilities/nature/mixkit-magical-light-moving-2584.wav');
        this.Fsfx = new Audio('../audio/abilities/fire/mixkit-fire-swoosh-burning-1328.wav');
        this.Esfx = new Audio('../audio/abilities/earth/stone-push-37412.mp3');
        this.Wsfx.volume = 0.4;
        this.Nsfx.volume = 0.4;
        this.Fsfx.volume = 0.4;
        this.Esfx.volume = 0.4;
        this.cam = [[],[],[],[]];
        this.abilityUsed = false;

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
        // element.addEventListener('gamepadconnected', this.gamepadHandler);

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
        
        // const up = [0,1,0];
        this.gamepads.update();
        // console.log(this.gamepads.buttonsStatus)
        let cos = Math.cos(0);
        let sin = Math.sin(0);
        // this.axesRotation = this.gamepads.axesStatus[2];
        // if (this.connected) {
        //     this.gamepads.update();
        //     // Calculate forward and right vectors.
        //     // this.yaw = ((this.gamepads.axesStatus[2] % Math.PI*2) + Math.PI*2) % Math.PI*2
        //     cos = Math.cos(((this.gamepads.axesStatus[2] % Math.PI*2) + Math.PI*2) % Math.PI*2);
        //     sin = Math.sin(((this.gamepads.axesStatus[2] % Math.PI*2) + Math.PI*2) % Math.PI*2);
        //     // console.log(this.gamepads.axesStatus)
        //     // console.log(this.is_moving)
        // }
        // else {
        //     cos = Math.cos(this.yaw);
        //     sin = Math.sin(this.yaw);
        // }
        const forward = [-sin, 0, -cos];
        const right = [10, 0, 0];
        // console.log("waiting for input")

        // Map user input to the acceleration vector.
        const rotation = quat.create();
        const acc = vec3.create();
        if (this.keys['KeyW'] || (this.connected && this.gamepads.buttonPressed('DPad-Up', 'Held'))) {
            vec3.add(acc, acc, forward);
            this.cam[0] = vec3.add(acc, acc, forward);
            quat.rotateY(rotation, rotation, 1.7320000000000046);
            // console.log(this.is_moving);
            this.is_moving = true;
            // console.log(this.is_moving);
        }
        if (this.keys['KeyS'] || (this.connected && this.gamepads.buttonPressed('DPad-Down', 'Held'))) {
            vec3.sub(acc, acc, forward);
            this.cam[1] = vec3.sub(acc, acc, forward);
            quat.rotateY(rotation, rotation, 4.899185307179586);
            this.is_moving = true;
        }
        if (this.keys['KeyD'] || (this.connected && this.gamepads.buttonPressed('DPad-Right', 'Held'))) {
            vec3.add(acc, acc, right);
            this.cam[2] = vec3.add(acc, acc, right);
            quat.rotateY(rotation, rotation, 0);
            this.is_moving = true;
        }
        if (this.keys['KeyA'] || (this.connected && this.gamepads.buttonPressed('DPad-Left', 'Held'))) {
            vec3.sub(acc, acc, right);
            this.cam[3] = vec3.sub(acc, acc, right);
            quat.rotateY(rotation, rotation, 3.1100000000000385);
            this.is_moving = true;
        }
        // if (this.keys['KeyW'] || (this.connected && this.gamepads.axesStatus[1] < -0.1)) {
        //     vec3.add(acc, acc, forward);
        //     this.cam[0] = vec3.add(acc, acc, forward);
        //     // console.log(this.is_moving);
        //     this.is_moving = true;
        //     // console.log(this.is_moving);
        // }
        // if (this.keys['KeyS'] || (this.connected && this.gamepads.axesStatus[1] > 0.1)) {
        //     vec3.sub(acc, acc, forward);
        //     this.cam[1] = vec3.sub(acc, acc, forward);
        //     this.is_moving = true;
        // }
        // if (this.keys['KeyD'] || (this.connected && this.gamepads.axesStatus[0] > 0.1)) {
        //     vec3.sub(acc, acc, right);
        //     this.cam[2] = vec3.sub(acc, acc, right);
        //     this.is_moving = true;
        // }
        // if (this.keys['KeyA'] || (this.connected && this.gamepads.axesStatus[0] < -0.1)) {
        //     vec3.add(acc, acc, right);
        //     this.cam[3] = vec3.add(acc, acc, right);
        //     this.is_moving = true;
        // }
        if (this.gamepads.buttonPressed('A')) {
            this.pritisk[0] = !this.pritisk[0];
            this.Wsfx.play();
            this.ability.water(this.obj1, this.pritisk[0]);
        }
        if (this.gamepads.buttonPressed('B')) {
            this.pritisk[1] = !this.pritisk[1];
            this.Nsfx.play();
            this.ability.nature(this.obj2, this.pritisk[1]);
        }
        if (this.gamepads.buttonPressed('X')) {
            this.pritisk[2] = !this.pritisk[2];
            this.Fsfx.play();
            this.ability.fire(this.obj3, this.pritisk[2]);
        }
        if (this.gamepads.buttonPressed('Y')) {
            this.pritisk[3] = !this.pritisk[3];
            this.Esfx.play();
            this.ability.earth(this.obj1, this.pritisk[3]);
        }

        this.node.rotation = rotation;
        
        // Update velocity based on acceleration.
        vec3.scaleAndAdd(this.velocity2, this.velocity2, acc, dt * this.acceleration);

        // If there is no user input, apply decay.
        if (this.connected) {
            if (!this.gamepads.buttonPressed('DPad-Up') && 
                !this.gamepads.buttonPressed('DPad-Down') && 
                !this.gamepads.buttonPressed('DPad-Right') &&
                !this.gamepads.buttonPressed('DPad-Left'))
            {
                const decay = Math.exp(dt * Math.log(1 - this.decay));
                vec3.scale(this.velocity2, this.velocity2, decay);
                this.is_moving = false;
            }
        }
        else {
            if ((!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA']))
            {
                const decay = Math.exp(dt * Math.log(1 - this.decay));
                vec3.scale(this.velocity2, this.velocity2, decay);
                this.is_moving = false;
            }
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
        // const rotation = quat.create();
        // if (this.connected) {
        //     let compu = this.gamepads.axesStatus[2];
        //     if (this.gamepads.axesStatus[2] > 0.2 || this.gamepads.axesStatus[2] < -0.2) {
        //         this.axesRotation += compu;
        //     }
        //     else {
        //         this.axesRotation -= compu;
        //     }
        //     quat.rotateY(rotation, rotation, this.axesRotation*this.pointerSensitivity);
        //     quat.rotateX(rotation, rotation, 0);
        // }
        // else {
        //     quat.rotateY(rotation, rotation, this.yaw);
        //     quat.rotateX(rotation, rotation, 0);
        // }
        // console.log(this.yaw);
        // this.node.rotation = rotation;
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
            if (this.abilityUsed == false) {
                this.pritisk[0] = !this.pritisk[0];
                this.Wsfx.play();
                this.abilityUsed = !this.abilityUsed;
                this.ability.water(this.obj1, this.pritisk[0]);
                this.keys['Digit1'] = this.pritisk[0];
            }
            else {
                this.abilityUsed = !this.abilityUsed;
                this.Wsfx.pause();
                this.Wsfx.currentTime = 0;
            }
            
        }
        else if (this.keys['Digit2']) {
            if (this.abilityUsed == false) {
                this.pritisk[1] = !this.pritisk[1];
                this.Nsfx.play();
                this.abilityUsed = !this.abilityUsed;
                this.ability.nature(this.obj2, this.pritisk[1]);
                this.keys['Digit2'] = this.pritisk[1];
            }
            else {
                this.abilityUsed = !this.abilityUsed;
                this.Nsfx.pause();
                this.Nsfx.currentTime = 0;
            }
        }
        else if (this.keys['Digit3']) {
            if (this.abilityUsed == false) {
                this.pritisk[2] = !this.pritisk[2];
                this.Fsfx.play();
                this.abilityUsed = !this.abilityUsed;
                this.ability.fire(this.obj3, this.pritisk[2]);
                this.keys['Digit3'] = this.pritisk[2];
            }
            else {
                this.abilityUsed = !this.abilityUsed;
                this.Fsfx.pause();
                this.Fsfx.currentTime = 0;
            }
        }
        else if (this.keys['Digit4']) {
            if (this.abilityUsed == false) {
                this.pritisk[3] = !this.pritisk[3];
                this.Esfx.play();
                this.abilityUsed = !this.abilityUsed;
                this.ability.earth(this.obj4, this.pritisk[3]);
                this.keys['Digit4'] = this.pritisk[3];
            }
            else {
                this.abilityUsed = !this.abilityUsed;
                this.Esfx.pause();
                this.Esfx.currentTime = 0;
            }
        }
        else if (this.keys['Space']) {
            this.pritisk[4] = !this.pritisk[4];
            console.log("skoci!")
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

    abilityInUse() {
        return this.abilityUsed;
    }

    getConnected() {
        return this.connected;
    }

    getButtonValues() {
        return this.gamepads.buttonsStatus;
    }
    
    getCam() {
        return this.cam;
    }
}

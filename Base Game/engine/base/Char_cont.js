import { quat, vec3, mat4 } from '../GL_matrix_lib/dist/gl-matrix-module.js';
import { Ability_movement, Ability_rotate } from '../../3d_models/animacije/level_animations.js';
import { abilities } from '../abilities.js';

export class Char_cont {

    constructor(node1, node2, domElement, camFollow, obj1, obj2, obj3, obj4, konc) {
        this.char = node1;
        this.camdis = node2;
        this.domElement = domElement;
        this.camFollow = camFollow;
        this.axesRotation = 0;
        this.dt = 0;
        this.keys = {};
        this.connected = false;
        this.is_moving = false;
        this.gamepads = {
            controller: {},
            connect(e) {
                this.controller = e.gamepad;
                console.log("Connected");
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
        this.wadaUse = new Ability_movement(obj1);
        this.wagnUse = new Ability_movement(obj2);
        this.naravaUse = new Ability_movement(obj3);
        this.erfUse = new Ability_rotate(obj4);
        this.finish = new Ability_movement(konc);
        
        this.pitch = 0;
        this.yaw = 0;

        this.GRAVITY = 9.81;
        this.velocityChar = [0, 0, 0];
        this.velocityCam = [0, 0, 0];
        this.acceleration = 5;
        this.maxSpeed = 5;
        this.decay = 0.99;
        this.pointerSensitivity = 0.002;
        this.ability = new abilities();
        this.pritisk = [false, false, false, false, false];
        this.posNow = vec3.create();
        this.posPrev = vec3.create();

        this.Wsfx = new Audio('../audio/abilities/water/mixkit-heal-soft-water-spell-878.wav');
        this.Nsfx = new Audio('../audio/abilities/nature/mixkit-magical-light-moving-2584.wav');
        this.Fsfx = new Audio('../audio/abilities/fire/mixkit-fire-swoosh-burning-1328.wav');
        this.Esfx = new Audio('../audio/abilities/earth/stone-push-37412.mp3');
        this.Wsfx.volume = 0.4;
        this.Nsfx.volume = 0.4;
        this.Fsfx.volume = 0.4;
        this.Esfx.volume = 0.4;
        this.cam = [[],[],[],[]];
        this.abilityUsed = [false,false,false,false];
        this.i = [[0],[0],[0],[0]];
        this.gravTest = 0;
        this.gravBool = true;
        this.char.extras.is_fall = 0;
        this.char.extras.is_jump = 0;
        this.erfYesNo = false;
        this.erfCount = 0;
        this.erfSetting = 20;
        this.wagnUse.setPremik(true);
        this.naravaUse.setPremik(true);

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
        // console.log(this.char.extras);
        this.dt = dt;
        this.gamepads.update();
        this.time = performance.now()/1000;
        // console.log(this.gamepads.buttonsStatus)
        // console.log(this.camdis.globalMatrix);
        const forward = [0, 0, -10];
        const right = [10, 0, 0];
        // Map user input to the acceleration vector.
        const rotation = quat.create();
        const acc = vec3.create();
        if (this.gravBool) {
            this.velocityChar[1] -= (this.GRAVITY*this.dt)*6;
            this.velocityCam[1] -= (this.GRAVITY*this.dt)*6;
        }
        else {
            if (this.gravTest < 20) {
                this.velocityChar[1] += (this.GRAVITY*this.dt)*6;
                this.velocityCam[1] += (this.GRAVITY*this.dt)*6;
                this.gravTest += 1;
            }
            else {
                this.gravTest = 0;
                this.gravBool = true;
                this.char.extras.is_fall = 1;
            }
        }
        // console.log(this.velocityChar);
        if (this.keys['KeyD'] || (this.connected && this.gamepads.buttonPressed('DPad-Up', 'Held'))) {
            vec3.add(acc, acc, forward);
            quat.rotateY(rotation, rotation, 1.7320000000000046);
            this.is_moving = true;
        }
        if (this.keys['KeyA'] || (this.connected && this.gamepads.buttonPressed('DPad-Down', 'Held'))) {
            vec3.sub(acc, acc, forward);
            // this.cam[1] = vec3.sub(acc, acc, forward);
            quat.rotateY(rotation, rotation, 4.899185307179586);
            this.is_moving = true;
            
        }
        if (this.keys['KeyS'] || (this.connected && this.gamepads.buttonPressed('DPad-Right', 'Held'))) {
            vec3.add(acc, acc, right);
            
            // this.cam[2] = vec3.add(acc, acc, right);
            quat.rotateY(rotation, rotation, 0);
            this.is_moving = true;
            
        }
        if (this.keys['KeyW'] || (this.connected && this.gamepads.buttonPressed('DPad-Left', 'Held'))) {
            vec3.sub(acc, acc, right);
            
            // this.cam[3] = vec3.sub(acc, acc, right);
            quat.rotateY(rotation, rotation, 3.1100000000000385);
            this.is_moving = true;
            
        }
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

        this.char.rotation = rotation;
        // Update velocity based on acceleration.
        vec3.scaleAndAdd(this.velocityChar, this.velocityChar, acc, this.dt * this.acceleration);
        vec3.scaleAndAdd(this.velocityCam, this.velocityCam, acc, this.dt * this.acceleration);

        // If there is no user input, apply decay.
        if (this.connected) {
            if (!this.gamepads.buttonPressed('DPad-Up') && 
                !this.gamepads.buttonPressed('DPad-Down') && 
                !this.gamepads.buttonPressed('DPad-Right') &&
                !this.gamepads.buttonPressed('DPad-Left'))
            {
                const decay = Math.exp(this.dt * Math.log(1 - this.decay));
                vec3.scale(this.velocityChar, this.velocityChar, decay);
                vec3.scale(this.velocityCam, this.velocityCam, decay);
                this.is_moving = false;
            }
        }
        else {
            if ((!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA']))
            {
                const decay = Math.exp(this.dt * Math.log(1 - this.decay));
                vec3.scale(this.velocityChar, this.velocityChar, decay);
                vec3.scale(this.velocityCam, this.velocityCam, decay);
                this.is_moving = false;
            }
        }
        
        this.keypressedHandler();
        // Limit speed to prevent accelerating to infinity and beyond.
        const speedChar = vec3.length(this.velocityChar);
        if (speedChar > this.maxSpeed) {
            vec3.scale(this.velocityChar, this.velocityChar, this.maxSpeed / speedChar);
        }
        const speedCam = vec3.length(this.velocityCam);
        if (speedCam > this.maxSpeed) {
            vec3.scale(this.velocityCam, this.velocityCam, this.maxSpeed / speedCam);
        }
        // Update translation based on velocity.
        this.char.translation = vec3.scaleAndAdd(vec3.create(),
            this.char.translation, this.velocityChar, dt);

        this.camdis.translation = vec3.scaleAndAdd(vec3.create(),
        this.camdis.translation, this.velocityCam, dt);

        this.wadaUse.update(0, 0, 0.08*Math.cos(this.time));
        
        this.wagnUse.update(0, 0.2*Math.cos(this.time), 0);
        
        this.naravaUse.update(0, 0.2*Math.sin(this.time), 0);
        if (this.erfYesNo == true) {
            this.finish.update(0, 0.7*Math.sin(this.time), 0);
        }
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

    keypressedHandler() {
        if (this.keys['Digit1']) {
            if (this.abilityUsed[0] == false) {
                this.pritisk[0] = !this.pritisk[0];
                this.Wsfx.play();
                this.abilityUsed[0] = !this.abilityUsed[0];
                this.ability.water(this.wadaUse, this.pritisk[0]);
                this.keys['Digit1'] = this.pritisk[0];
            }
            else {
                this.abilityUsed[0] = !this.abilityUsed[0];
                this.Wsfx.pause();
                this.Wsfx.currentTime = 0;
            }
            
        }
        else if (this.keys['Digit2']) {
            if (this.abilityUsed[1] == false) {
                this.pritisk[1] = !this.pritisk[1];
                this.Fsfx.play();
                this.abilityUsed[1] = !this.abilityUsed[1];
                this.ability.fire(this.wagnUse, !this.pritisk[1]);
                this.keys['Digit2'] = this.pritisk[1];
            }
            else {
                this.abilityUsed[1] = !this.abilityUsed[1];
                this.Fsfx.pause();
                this.Fsfx.currentTime = 0;
            }
        }
        else if (this.keys['Digit3']) {
            if (this.abilityUsed[2] == false) {
                this.pritisk[2] = !this.pritisk[2];
                this.Nsfx.play();
                this.abilityUsed[2] = !this.abilityUsed[2];
                this.ability.nature(this.naravaUse, this.pritisk[2]);
                this.keys['Digit3'] = this.pritisk[2];
            }
            else {
                this.abilityUsed[2] = !this.abilityUsed[2];
                this.Nsfx.pause();
                this.Nsfx.currentTime = 0;
            }
        }
        else if (this.keys['Digit4']) {
            if (this.abilityUsed[3] == false && this.erfYesNo == false) {
                this.pritisk[3] = !this.pritisk[3];
                this.Esfx.play();
                this.abilityUsed[3] = !this.abilityUsed[3];
                console.log("oke")
                this.erfUse.update();
                this.erfYesNo = true;
                this.keys['Digit4'] = this.pritisk[3];
            }
            else {
                this.abilityUsed[3] = !this.abilityUsed[3];
                this.Esfx.pause();
                this.Esfx.currentTime = 0;
            }
        }
        else if (this.keys['Space']) {
            if (this.char.extras.is_jump == 0 && this.char.extras.is_stand == 1 && this.char.extras.is_fall == 0) {
                this.pritisk[4] = !this.pritisk[4];
                this.gravBool = false;
                this.char.extras.is_jump = 1;
                this.char.extras.is_stand = 0;
                this.keys['Space'] = this.pritisk[4];
            }
        }
    }

    is_moving() {
        return this.is_moving;
    }
}

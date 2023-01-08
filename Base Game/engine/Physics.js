import { vec3, mat4 } from './GL_matrix_lib/dist/gl-matrix-module.js';


export class Physics {

    constructor(scene, body, box, Dnoga, Droka, Lnoga, Lroka, cam, kulci, spawn, CS, domElement) {
        this.body = body;
        this.Dnoga = Dnoga;
        this.Droka = Droka;
        this.Lnoga = Lnoga;
        this.Lroka = Lroka;
        this.box = box
        this.scene = scene;
        this.cam = cam;
        this.colili = kulci;
        this.ded = spawn;
        this.camSpawn = CS;
        this.doc = domElement.ownerDocument;
    }

    update(dt) {
        this.scene.traverse(node => {
            // Move every node with defined velocity.
            if (node == this.body) {
                vec3.scaleAndAdd(node.translation, node.translation, node.velocity, dt);
                node.updateTransformationMatrix();

                // After moving, check for collision with every other node.
                this.scene.traverse(other => {
                    if (node !== other && other != this.box && this.colili.includes(other) && !this.colili.includes(node)) {
                        this.resolveCollision(node, other);
                    }
                });
            }
            
        });
    }

    intervalIntersection(min1, max1, min2, max2) {
        return !(min1 > max2 || min2 > max1);
    }

    aabbIntersection(aabb1, aabb2) {
        return this.intervalIntersection(aabb1.min[0], aabb1.max[0], aabb2.min[0], aabb2.max[0])
            && this.intervalIntersection(aabb1.min[1], aabb1.max[1], aabb2.min[1], aabb2.max[1])
            && this.intervalIntersection(aabb1.min[2], aabb1.max[2], aabb2.min[2], aabb2.max[2]);
    }

    getTransformedAABB(node) {
        // Transform all vertices of the AABB from local to global space.
        const transform = node.globalMatrix;
        const { min, max } = node.aabb;
        const vertices = [
            [min[0], min[1], min[2]],
            [min[0], min[1], max[2]],
            [min[0], max[1], min[2]],
            [min[0], max[1], max[2]],
            [max[0], min[1], min[2]],
            [max[0], min[1], max[2]],
            [max[0], max[1], min[2]],
            [max[0], max[1], max[2]],
        ].map(v => vec3.transformMat4(v, v, transform));

        // Find new min and max by component.
        const xs = vertices.map(v => v[0]);
        const ys = vertices.map(v => v[1]);
        const zs = vertices.map(v => v[2]);
        const newmin = [Math.min(...xs), Math.min(...ys), Math.min(...zs)];
        const newmax = [Math.max(...xs), Math.max(...ys), Math.max(...zs)];
        return { min: newmin, max: newmax };
    }

    resolveCollision(a, b) {
        // Get global space AABBs.
        const aBox = this.getTransformedAABB(a);
        const bBox = this.getTransformedAABB(b);

        // Check if there is collision.
        const isColliding = this.aabbIntersection(aBox, bBox);
        // console.log(isColliding)
        if (!isColliding) {
            return;
        }
        if (b.name == 'ubijalska_povrsina_velika') {
            // console.log("oj")
            a.translation = this.ded.translation;
            this.cam.translation = this.camSpawn.translation;
        }
        if (b.extras.isFinish && b.extras.isFinish == 1) {
            // this.doc.querySelectorAll('audio').forEach(el => el.pause());
            b.extras.isFinish = 0;
            window.open('finish.html', "_self");
            return;
        }
        // console.log("trk")
        // console.log(a.name," ",b.name);
        // Move node A minimally to avoid collision.
        const diffa = vec3.sub(vec3.create(), bBox.max, aBox.min);
        const diffb = vec3.sub(vec3.create(), aBox.max, bBox.min);

        let minDiff = Infinity;
        let minDirection = [0, 0, 0];
        if (diffa[0] >= 0 && diffa[0] < minDiff) {
            minDiff = diffa[0];
            minDirection = [minDiff, 0, 0];
        }
        if (diffa[1] >= 0 && diffa[1] < minDiff) {
            minDiff = diffa[1];
            minDirection = [0, minDiff, 0];
        }
        if (diffa[2] >= 0 && diffa[2] < minDiff) {
            minDiff = diffa[2];
            minDirection = [0, 0, minDiff];
        }
        if (diffb[0] >= 0 && diffb[0] < minDiff) {
            minDiff = diffb[0];
            minDirection = [-minDiff, 0, 0];
        }
        if (diffb[1] >= 0 && diffb[1] < minDiff) {
            minDiff = diffb[1];
            minDirection = [0, -minDiff, 0];
        }
        if (diffb[2] >= 0 && diffb[2] < minDiff) {
            minDiff = diffb[2];
            minDirection = [0, 0, -minDiff];
        }

        a.translation = vec3.add(a.translation, a.translation, minDirection);
        this.cam.translation = vec3.add(this.cam.translation, this.cam.translation, minDirection);
        a.extras.is_jump = 0;
        a.extras.is_stand = 1;
        a.extras.is_fall = 0;
    }

}

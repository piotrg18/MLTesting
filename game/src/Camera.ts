import {Vector} from './Vector';

export default class Camera {
    pos: Vector;
    size: Vector;
    constructor() {
        this.pos = new Vector(0, 0);
        //camera size nintendo
        this.size = new Vector(640, 480);
    }
}

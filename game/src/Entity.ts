import { Vector } from "./Vector";

export class Entity{
    vel: Vector;
    pos: Vector;
    constructor() {
        this.pos = new Vector(0, 0);
        this.vel = new Vector(0, 0);
    }
}
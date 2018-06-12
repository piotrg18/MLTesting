import {Trait} from '../Entity';

export class Go extends Trait {
    speed: number;
    dir: number;
    constructor() {
        super('go');

        this.dir = 0;
        this.speed = 6000;
    }

    update(entity, deltaTime) {
        entity.vel.x = this.speed * this.dir * deltaTime;
    }
}

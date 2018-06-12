import { Trait, Entity } from "../Entity";

export class Velocity extends Trait{
    constructor(){
        super('velocity');
    }
    update(entity:Entity, deltaTime) {
        entity.pos.x += entity.vel.x * deltaTime;
        entity.pos.y += entity.vel.y * deltaTime;
    }
}
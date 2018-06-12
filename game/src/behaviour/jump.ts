import { Trait, Entity } from "../Entity";

export class Jump extends Trait {
    engageTime: number;
    velocity: number;
    duration: number;
    constructor(){
        super('jump')
        this.duration = 0.5;
        this.velocity = 200;
        this.engageTime = 0;
    }
    startJump() {
        this.engageTime = this.duration;
    }
    update(entity:Entity,deltaTime){
        if(this.engageTime > 0){
            entity.vel.y = -this.velocity;
            this.engageTime -= deltaTime 
        }
    }
    cancelJump(){
        this.engageTime = 0;
    }
}
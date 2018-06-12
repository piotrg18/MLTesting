import { Vector } from "./Vector";

export class Trait {
    NAME: string;
    constructor(name) {
        this.NAME = name;
    }

    update(entity:Entity, deltaTime) {
        console.warn('Unhandled update call in Trait');
    }
}


export class Entity{
    size: Vector;
    traits: any[];
    vel: Vector;
    pos: Vector;
    constructor() {
        this.pos = new Vector(0, 0);
        this.vel = new Vector(0, 0);
        this.size = new Vector(0, 0);
        this.traits = [];
    }

    addTrait(trait) {
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    update(deltaTime) {
        this.traits.forEach(trait => {
            trait.update(this, deltaTime);
        });
    }
}
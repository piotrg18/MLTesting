import { Vector } from "./Vector";


export const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
};

export class Trait {
    NAME: string;
    constructor(name) {
        this.NAME = name;
    }

    obstruct(entity, side) {

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

    obstruct(side) {
        this.traits.forEach(trait => {
            trait.obstruct(this, side);
        });
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
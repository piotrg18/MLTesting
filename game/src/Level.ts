
import TileCollider from './TileColider';
import {Matrix} from './Vector';

export default class Level {
    tileCollider: any;
    tiles: Matrix;
    entities: Set<any>;
    comp: any;
    gravity: number;
    constructor() {
        this.gravity = 2000;

        this.entities = new Set();
        this.tiles = new Matrix();

        this.tileCollider = new TileCollider(this.tiles);
    }

    update(deltaTime) {
        this.entities.forEach(entity => {
            entity.update(deltaTime);

            entity.pos.x += entity.vel.x * deltaTime;
            this.tileCollider.checkX(entity);

            entity.pos.y += entity.vel.y * deltaTime;
            this.tileCollider.checkY(entity);

            entity.vel.y += this.gravity * deltaTime;
        });
    }
}

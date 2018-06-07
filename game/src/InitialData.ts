import SpriteSheet from "./SpriteSheet";
import { createBackgroundLayer } from "./layersUtils";
import { Entity } from "./Entity";

function createSpriteLayer(sprite, pos) {
    return function drawSpriteLayer(context) {
        sprite.draw('idle', context, pos.x, pos.y);
    };
}

export class Compositor{
    layers: any[];
    backgroudsprites: SpriteSheet;
    marioSprite :SpriteSheet;
    levels: any;
    constructor(image:any,levels:any, marioImage:any){
        this.levels = levels;
        this.backgroudsprites = new SpriteSheet(image, 16, 16);
        this.backgroudsprites.defineTile('ground', 0, 0);
        this.backgroudsprites.defineTile('sky', 3, 23);
        this.marioSprite = new SpriteSheet(marioImage,16,16);
        this.marioSprite.define('idle', 276, 44, 16, 16);

        this.layers = [];
    }
    draw(context,mario:Entity) {
        
        if(this.layers.length === 0){
            this.initLayers(mario.pos)
        }
        this.layers.forEach(layer => {
            layer(context);
        });
    }
    initLayers(pos){
        this.layers.push(createBackgroundLayer(this.levels.backgrounds, this.backgroudsprites));
        this.layers.push(createSpriteLayer(this.marioSprite, pos));
    } 
}
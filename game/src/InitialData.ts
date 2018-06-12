import SpriteSheet from "./SpriteSheet";
import { createBackgroundLayer, createSpriteLayer } from "./layersUtils";
import { Entity } from "./Entity";
import Level from "./Level";
import Camera from "./Camera";



function createTiles(level, backgrounds) {
    function applyRange(background, xStart, xLen, yStart, yLen) {
        const xEnd = xStart + xLen;
        const yEnd = yStart + yLen;
        for (let x = xStart; x < xEnd; ++x) {
            for (let y = yStart; y < yEnd; ++y) {
                level.tiles.set(x, y, {
                    name: background.tile,
                    type: background.type,
                });
            }
        }
    }
    backgrounds.forEach(background => {
        background.ranges.forEach(range => {
            if (range.length === 4) {
                const [xStart, xLen, yStart, yLen] = range;
                applyRange(background, xStart, xLen, yStart, yLen);

            } else if (range.length === 3) {
                const [xStart, xLen, yStart] = range;
                applyRange(background, xStart, xLen, yStart, 1);

            } else if (range.length === 2) {
                const [xStart, yStart] = range;
                applyRange(background, xStart, 1, yStart, 1);
            }
        });
    });

}




export class Compositor{
    level: Level;
    mario: Entity;
    layers: any[];
    backgroudsprites: SpriteSheet;
    marioSprite :SpriteSheet;
    levels: any;
    constructor(levelSpec:any, marioImage:any,initMario:Entity){
        this.levels = levelSpec;
        this.backgroudsprites = levelSpec.spriteSheet;
        this.marioSprite = new SpriteSheet(marioImage,16,16);
        this.marioSprite.define('idle', 276, 44, 16, 16);

        this.mario = initMario;
        this.level = new Level();
        this.layers = [];
        createTiles(this.level, levelSpec.mainLevel.backgrounds);
        this.level.entities.add(initMario);
        const backgroundLayer = createBackgroundLayer(this.level, this.backgroudsprites);
        this.layers.push(backgroundLayer);
        const spriteLayer = createSpriteLayer(this.level.entities);
        this.layers.push(spriteLayer);
        let marioContext = this.mario;
        let currentContext = this;
        initMario["draw"] = function (context){
            currentContext.marioSprite.draw('idle', context, 0, 0);
        }


     
    }
    draw(context,mario:Entity,camera:Camera) {
        
        this.layers.forEach(layer => {
            layer(context, camera);
        });
    }
    initLayers(pos){
     
    } 
}
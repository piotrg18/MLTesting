import SpriteSheet from "./SpriteSheet";

export class InitialData{
    sprites: SpriteSheet;
    levels: any;
    constructor(image:any,levels:any){
        this.levels = levels;
        this.sprites = new SpriteSheet(image);
        this.sprites.define('ground', 0, 0);
        this.sprites.define('sky', 3, 23);
    }
}
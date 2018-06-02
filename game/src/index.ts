import SpriteSheet from "./SpriteSheet";

declare const p5: any
var levels:any;
var allSprites:any;
var sprites:SpriteSheet;

function drawBackground(background, context, sprites) {
    background.ranges.forEach(([x1, x2, y1, y2]) => {
        for (let x = x1; x < x2; ++x) {
            for (let y = y1; y < y2; ++y) {
                sprites.drawTile(background.tile, context, x, y);
            }
        }
    });
}

var sketch = (p:any) => {
    p.preload = () => {
        var url ='/public/1-1.json';
        levels = p.loadJSON(url);
        allSprites = p.loadImage('public/img/tiles.png');


    };
    p.setup = () => {
        p.createCanvas(640,480);
        
        sprites = new SpriteSheet(allSprites);
        sprites.define(p.createGraphics(640, 480),'ground', 0, 0);
        sprites.define(p.createGraphics(640, 480),'sky', 3, 23);
      
    };
  
    p.draw = () => {
        levels.backgrounds.forEach(bg => {
            drawBackground(bg, p, sprites);
        });
      
    };
  
    p.keyPressed = () => {
    }
};
var sketchP = new p5(sketch);

import {Player}  from './player';
import {Obstacle} from "./obstacle"
import {Game} from "./Game"

declare var p5: any;
let player  :Player; 
let game: Game;

var sketch = (p) => {
  p.preload = () => {
    player = new Player(p.height);
    game = new Game(p.height, p.width, p.random);
  };
  p.setup = () => {
      p.createCanvas(640,480);
      p.frameRate(60);
    
  };

  p.draw = () => {
      p.background(100);
      game.draw(p, player);
    
  };

  p.keyPressed = () => {
    if (p.key == ' ') {
        player.move();
     
      }
  };
};
var sketchP = new p5(sketch);


 

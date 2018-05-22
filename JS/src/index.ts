import {Player}  from './player';
import {Obstacle} from "./obstacle"
import {Game} from "./Game"
//import * as tf from '@tensorflow/tfjs';
import {NeuralNetwork} from "./neuralnetwork";

declare var p5: any;
let player  :Player; 
let game: Game;

var sketch = (p) => {
  p.preload = () => {
  };
  p.setup = () => {
      p.createCanvas(640,480);
      //p.frameRate(30);
      game = new Game(p.height, p.width, p);
  };

  p.draw = () => {
      p.background(100);
      game.draw(p);
  };

  
};
var sketchP = new p5(sketch);




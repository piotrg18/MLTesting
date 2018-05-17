import {Player}  from './player';
import {Obstacle} from "./obstacle"
import {Game} from "./Game"
import * as tf from '@tensorflow/tfjs';

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
      
      //console.log("Dummy");
  };

  p.draw = () => {
      p.background(100);
      game.draw(p, player);
      //player.show();
  };

  p.keyPressed = () => {
    if (p.key == ' ') {
        player.move();
        //console.log("SPACE");
      }
  };
};
var sketchP = new p5(sketch);
console.log("Dummy");

    // Define a model for linear regression.
const model = tf.sequential();
model.add(tf.layers.dense({units: 1, inputShape: [1]}));

// Prepare the model for training: Specify the loss and the optimizer.
model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});


console.log("Data sdadas");
// Generate some synthetic data for training.
const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

console.log("End");


  


 

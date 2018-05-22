import {Player}  from './player';
import {Obstacle} from "./obstacle"
import {Game} from "./Game"
//import * as tf from '@tensorflow/tfjs';
import {NeuralNetwork} from "./neuralnetwork";

declare var p5: any;
let player  :Player; 
let game: Game;

// var sketch = (p) => {
//   p.preload = () => {
//     player = new Player(p.height);
//     game = new Game(p.height, p.width, p.random);
//   };
//   p.setup = () => {
//       p.createCanvas(640,480);
//       //p.frameRate(60);
      
//       //console.log("Dummy");
//   };

//   p.draw = () => {
//       p.background(100);
//       game.draw(p, player);
//       //tf.randomNormal([15000, 15000]);


// //t.dispose();
// //console.table(b);
  
//       //player.show();
//   };

//   p.keyPressed = () => {
//     if (p.key == ' ') {
//         player.move();
//         //console.log("SPACE");
//       }
//   };
// };
// var sketchP = new p5(sketch);


//const model = tf.sequential();

let d = new NeuralNetwork();
d.mutate((num) => 0.01, () => 2);
let t = d.predict([0.44,0.98,0.5,0.6,0.8]);

let copied = d.copy();
// model.add(tf.layers.dense({ units: 8 , name: 'hiddenLayer',biasInitializer :'randomUniform',  activation: 'sigmoid' , inputShape: [5] }) );  
// model.add(tf.layers.dense({ units: 2, name: 'outputLayer', activation: 'sigmoid' }) );    
// //model.predict()

// model.compile({optimizer: 'sgd', loss: 'binaryCrossentropy'})
// let xs = tf.tensor([[0.44,0.98,0.5,0.6,0.8]]);
// //model.layers[0].setWeights([tf.tensor([2,4,4,5,7,3,6,3,2]), tf.ones([8])]);
// model.layers[0].getWeights()[0].print();
// model.layers[0].getWeights()[1].print();

// model.layers[1].getWeights()[0].print();
// model.layers[1].getWeights()[1].print();

// console.table((model.predict(xs) as tf.Tensor).dataSync());



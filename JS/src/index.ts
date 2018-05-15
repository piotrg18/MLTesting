import * as tf from '@tensorflow/tfjs';
declare var p5: any;

console.log("dsdsa");
var sketch = (p) => {
  p.preload = () => {
  };
  p.setup = () => {
      p.createCanvas(600,400);
      p.frameRate(10);
  };

  p.update = () => {
      console.log("update")
  };
  p.draw = () => {
      p.background(30);
      console.log("draw");
  };
};
var sketchP = new p5(sketch);
console.log("dasdas")

  
    // Define a model for linear regression.
const model = tf.sequential();
model.add(tf.layers.dense({units: 1, inputShape: [1]}));

// Prepare the model for training: Specify the loss and the optimizer.
model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});


console.log("Data sdadas");
// Generate some synthetic data for training.
const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

console.log("dasa");

// Train the model using the data.
model.fit(xs, ys).then(() => {
  // Use the model to do inference on a data point the model hasn't seen before:
  (model.predict(tf.tensor2d([5], [1, 1])) as tf.Tensor).print();
});
  


 

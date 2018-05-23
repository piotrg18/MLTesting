import * as tf from '@tensorflow/tfjs';
import { Model, Sequential } from '@tensorflow/tfjs';
import { TypedArray } from '@tensorflow/tfjs-core/dist/kernels/webgl/tex_util';
import { INeuralNetwork } from './INeuralNetwork';
import { Random } from './Random';

export class NeuralNetwork implements INeuralNetwork{
    


    model:Sequential;
    constructor(){
        this.model = tf.sequential();
        const initializer = tf.initializers.randomUniform({minval:-1, maxval:1});

        this.model.add(tf.layers.dense({ units: 8 , name: 'hiddenLayer',biasInitializer :initializer,  activation: 'sigmoid' , inputShape: [5] }) );  
        this.model.add(tf.layers.dense({ units: 2, name: 'outputLayer', useBias:true, biasInitializer:initializer , activation: 'sigmoid' }) );    
        //this.model.compile({optimizer: 'sgd', loss: 'binaryCrossentropy'})
 
        
        
    }
    mutate(func) :void{
        let W1 = this.model.layers[0].getWeights()[0].dataSync() as Float32Array;
        let B1 = this.model.layers[0].getWeights()[1].dataSync() as Float32Array;


        

        let changedW1 = W1.map(func);
        let changedB1 = B1.map(func);
        
        this.model.layers[0].setWeights([tf.tensor(changedW1, [5,8]),tf.tensor(changedB1)]);

        let W2 = this.model.layers[1].getWeights()[0].dataSync() as Float32Array;
        let B2 = this.model.layers[1].getWeights()[1].dataSync() as Float32Array;

        let changedW2 = W2.map(func);
        let changedB2 = B2.map(func);

        this.model.layers[1].setWeights([tf.tensor(changedW2, [8,2]),tf.tensor(changedB2)]);
    }

    copy() : INeuralNetwork{
        let copy = new NeuralNetwork();
        copy.model.layers[0].setWeights(this.model.layers[0].getWeights());
        copy.model.layers[1].setWeights(this.model.layers[1].getWeights());
        return copy;
    }
    predict(inputs:Array<number>) {
        let xs = tf.tensor([inputs]);
        let result = ((this.model.predict(xs) as tf.Tensor).dataSync() as Float32Array);
        return Array.from(result);
    }

}
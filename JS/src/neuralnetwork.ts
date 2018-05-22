import * as tf from '@tensorflow/tfjs';
import { Model, Sequential } from '@tensorflow/tfjs';
import { TypedArray } from '@tensorflow/tfjs-core/dist/kernels/webgl/tex_util';

export class NeuralNetwork {
    
    p5: any;
    model:Sequential;

  
    constructor(p5:any){
        this.model = tf.sequential();
        this.p5 = p5;
        const initializer = tf.initializers.randomUniform({minval:-1, maxval:1});
        
        this.model.add(tf.layers.dense({ units: 8 , name: 'hiddenLayer',biasInitializer :initializer,  activation: 'sigmoid' , inputShape: [5] }) );  
        this.model.add(tf.layers.dense({ units: 2, name: 'outputLayer', useBias:true, biasInitializer:initializer , activation: 'sigmoid' }) );    
        //this.model.compile({optimizer: 'sgd', loss: 'binaryCrossentropy'})
        
        
    }
    mutate() :void{
        let W1 = this.model.layers[0].getWeights()[0].dataSync() as Float32Array;
        let B1 = this.model.layers[0].getWeights()[1].dataSync() as Float32Array;
        
        let changedW1 = this.mutateInternal(W1);
        let changedB1 = this.mutateInternal(B1);
        
        this.model.layers[0].setWeights([tf.tensor(changedW1, [5,8]),tf.tensor(changedB1)]);

        let W2 = this.model.layers[1].getWeights()[0].dataSync() as Float32Array;
        let B2 = this.model.layers[1].getWeights()[1].dataSync() as Float32Array;

        let changedW2 = this.mutateInternal(W2);
        let changedB2 = this.mutateInternal(B2);

        this.model.layers[1].setWeights([tf.tensor(changedW2, [8,2]),tf.tensor(changedB2)]);
    }

    copy(p5:any) : NeuralNetwork{
        let copy = new NeuralNetwork(p5);
        copy.model.layers[0].setWeights(this.model.layers[0].getWeights());
        copy.model.layers[1].setWeights(this.model.layers[1].getWeights());
        return copy;
    }

    private mutateInternal(original:Float32Array) :Float32Array {
        
        for(let i = 0 ; i< original.length; i++){
            if(this.p5.random(1)< 0.1){
             
                let offset = this.p5.randomGaussian() * 0.5;
                let newElement = original[i] + offset;
                original[i] = newElement;
            }
        }
        return original;
    }

    predict(inputs:Array<number>) {
        let xs = tf.tensor([inputs]);
        
        
        let result = ((this.model.predict(xs) as tf.Tensor).dataSync() as Float32Array);
        
        return result;
    }

}
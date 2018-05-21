import * as tf from '@tensorflow/tfjs';
import { Model, Sequential } from '@tensorflow/tfjs';
import { TypedArray } from '@tensorflow/tfjs-core/dist/kernels/webgl/tex_util';

export class NeuralNetwork {
    
    model:Sequential;

  
    constructor(){
        this.model = tf.sequential();
        
        const initializer = tf.initializers.randomUniform({minval:-1, maxval:1});
        
        this.model.add(tf.layers.dense({ units: 8 , name: 'hiddenLayer',biasInitializer :initializer,  activation: 'sigmoid' , inputShape: [5] }) );  
        this.model.add(tf.layers.dense({ units: 2, name: 'outputLayer', useBias:true, biasInitializer:initializer , activation: 'sigmoid' }) );    
        this.model.compile({optimizer: 'sgd', loss: 'binaryCrossentropy'})
        
        
        
        // this.model.layers[0].getWeights()[0].print();
        // this.model.layers[0].getWeights()[1].print();

        // this.model.layers[1].getWeights()[0].print();
        // this.model.layers[1].getWeights()[1].print();


        // console.table((this.model.predict(xs) as tf.Tensor).dataSync());
    }
    mutate(randomFunc: (max: number) => number, randomGuassian: () => number) :void{
        this.model.layers[0].getWeights()[0].print();
        let W1 = this.model.layers[0].getWeights()[0].dataSync() as Float32Array;
        let B1 = this.model.layers[0].getWeights()[1].dataSync() as Float32Array;
        
        let changedW1 = this.mutateInternal(W1, randomFunc, randomGuassian);
        let changedB1 = this.mutateInternal(B1, randomFunc, randomGuassian);
        
        this.model.layers[0].setWeights([tf.tensor(changedW1, [5,8]),tf.tensor(changedB1)]);

        let W2 = this.model.layers[1].getWeights()[0].dataSync() as Float32Array;
        let B2 = this.model.layers[1].getWeights()[1].dataSync() as Float32Array;

        let changedW2 = this.mutateInternal(W2, randomFunc, randomGuassian);
        let changedB2 = this.mutateInternal(B2, randomFunc, randomGuassian);

        this.model.layers[1].setWeights([tf.tensor(changedW2, [8,2]),tf.tensor(changedB2)]);
        
        this.model.layers[0].getWeights()[0].print();
        this.model.layers[0].getWeights()[1].print();
        this.model.layers[1].getWeights()[1].print();
        
        
    }

    copy() : NeuralNetwork{
        let copy = new NeuralNetwork();
        copy.model.layers[0].setWeights(this.model.layers[0].getWeights());
        copy.model.layers[1].setWeights(this.model.layers[1].getWeights());
        
        copy.model.layers[0].getWeights()[0].print();
        copy.model.layers[0].getWeights()[1].print();
        copy.model.layers[1].getWeights()[0].print();
        copy.model.layers[1].getWeights()[1].print();
        return copy;
    }

    private mutateInternal(original:Float32Array, randomFunc: (max: number) => number, randomGuassian: () => number) :Float32Array {
        let tmp = original.map(element => {
            if(randomFunc(1)< 0.1){
                let offset = randomGuassian() * 0.5;
                let newElement = element + offset;
                return newElement;
            }
            else{
                return element;
            }
        });
        return tmp;
    }

    predict():void {
        let xs = tf.tensor([[0.44,0.98,0.5,0.6,0.8]]);
        console.table((this.model.predict(xs) as tf.Tensor).dataSync());
        console.table((this.model.predict(xs) as tf.Tensor).dataSync());
    }

}
import * as tf from '@tensorflow/tfjs';

import {  Observable,of,animationFrameScheduler, forkJoin, from, BehaviorSubject  } from 'rxjs';
import { buffer, bufferCount,expand, filter, map,  share, tap, withLatestFrom,timestamp, switchMap, zip} from 'rxjs/operators';


const drawingArea: HTMLElement= document.getElementById('screen');
const context = (drawingArea as HTMLCanvasElement).getContext('2d');

class FrameData{
    constructor(public frameStartTime:number, public deltaTime:number){
    }
}


const calculateStep: (prevFrame: FrameData) => Observable<FrameData> = (prevFrame: FrameData) => {
    return Observable.create((observer) => {       
      requestAnimationFrame((frameStartTime) => {      
        // Millis to seconds
        const deltaTime = prevFrame ? (frameStartTime - prevFrame.frameStartTime) / 1000 : 0;
        observer.next(new FrameData(frameStartTime,deltaTime));
      })
    })
  };

const frames$ = of(undefined)
  .pipe(
    expand((val) => calculateStep(val)),
    filter( frame => frame !== undefined),
    map((frame:FrameData) => frame.deltaTime),
    share()
);

let x_vals = [];
let y_vals = [];

let a, b, c, d;
let dragging = false;

const learningRate = 0.2;
const optimizer = tf.train.adam(learningRate);

function loss(pred, labels) {
    return pred.sub(labels).square().mean();
}

function setup(){
    a = tf.variable(tf.scalar(random(-1, 1)));
    b = tf.variable(tf.scalar(random(-1, 1)));
    c = tf.variable(tf.scalar(random(-1, 1)));
    d = tf.variable(tf.scalar(random(-1, 1)));
}

function predict(x) {
    const xs = tf.tensor1d(x);
    // y = ax^3 + bx^2 + cx + d
    const ys = xs.pow(tf.scalar(3)).mul(a)
      .add(xs.square().mul(b))
      .add(xs.mul(c))
      .add(d);
    return ys;
  }


const render = (deltaTime:number) => {
    context.fillStyle = "rgb(0,0,0)";
    context.fillRect (0, 0, drawingArea.clientWidth, drawingArea.clientHeight);
    
    
}

frames$.subscribe((deltaTime) => {
    render(deltaTime);
});


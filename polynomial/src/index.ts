import * as tf from '@tensorflow/tfjs';

import {  Observable,of,animationFrameScheduler, forkJoin, from, BehaviorSubject  } from 'rxjs';
import { buffer, bufferCount,expand, filter, map,  share, tap, withLatestFrom,timestamp, switchMap, zip} from 'rxjs/operators';
import { frames$, keysDownOrUpPerFrame$, MouseVector } from './inputMouse';


const drawingArea: HTMLElement= document.getElementById('screen');
const context = (drawingArea as HTMLCanvasElement).getContext('2d');

const width = (drawingArea as HTMLCanvasElement).width
const height = (drawingArea as HTMLCanvasElement).height







let x_vals = [];
let y_vals = [];

let a, b, c, d;
let dragging = false;

const learningRate = 0.2;
const optimizer = tf.train.adam(learningRate);

function loss(pred, labels) {
    return pred.sub(labels).square().mean();
}

function random(min:number, max:number){
    let rand = Math.random();
    return rand * (max - min) + min;
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
const mapData = (n:number, start1:number, stop1:number, start2:number, stop2:number) =>{
    var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    return newval;
    
};


setup();
function drawPoint(px:number, py:number){
    context.fillStyle = "rgb(255,255,255)";
    context.lineWidth= 8;
    px = Math.round(px);
    py = Math.round(py);
    context.beginPath();
    context.arc(px, py, context.lineWidth / 2, 0, Math.PI * 2, false);
    context.fill();
}
function drawCurve(vertices:any){
    //debugger;
    if (vertices.length === 0) {
        return;
    }
    context.beginPath();
    //debugger;
    context.moveTo(vertices[0][0], vertices[0][1]);
    const numVerts = vertices.length;
    for (let i = 1; i < numVerts; i++) {
        let v = vertices[i];
        context.lineTo(v[0], v[1]);    
    }
    context.stroke();
    context.closePath();

}

const render = (deltaTime:number,inputMouse:MouseVector) => {
    context.fillStyle = "rgb(0,0,0)";
    context.strokeStyle = "#000000";
    context.fillRect (0, 0, width, height);
    if(inputMouse.state == 1){
        
        let x = mapData(inputMouse.x, 0, width, -1, 1);
        let y = mapData(inputMouse.y, 0, height, 1, -1);
        x_vals.push(x);
        y_vals.push(y);
    }
    else{
        //debugger;
        tf.tidy(() => {
            if (x_vals.length > 0) {
              const ys = tf.tensor1d(y_vals);
              optimizer.minimize(() => loss(predict(x_vals), ys));
            }
          });
    }

    for (let i = 0; i < x_vals.length; i++) {
        let px = mapData(x_vals[i], -1, 1, 0, width);
        let py = mapData(y_vals[i], -1, 1, height, 0);
        drawPoint(px, py);
    }
    
    const curveX = [];
    for (let x = -1; x <= 1; x += 0.05) {
      curveX.push(x);
    }
    const ys = tf.tidy(() => predict(curveX));
    let curveY = ys.dataSync();
    ys.dispose();

   
    
    context.fillStyle = "#ffffff";
    context.lineWidth = 2;
    context.strokeStyle = "#ffffff";
    let tmpArray = [];
    for (let i = 0; i < curveX.length; i++) {
        let x = mapData(curveX[i], -1, 1, 0, width);
        let y = mapData(curveY[i], -1, 1, height, 0);
        let vert = [];
        vert[0] = x;
        vert[1] = y;
        tmpArray.push(vert)
        
    }
    drawCurve(tmpArray);

    
}

frames$.pipe(
    withLatestFrom(keysDownOrUpPerFrame$)
).subscribe(([deltaTime,inputMouse]) => {
    render(deltaTime,inputMouse);
});


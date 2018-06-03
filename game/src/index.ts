import SpriteSheet from "./SpriteSheet";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable,of,animationFrameScheduler, forkJoin } from 'rxjs';
import { Scheduler ,  } from "rxjs/Scheduler";
import { fromEvent } from 'rxjs/observable/fromEvent';
import { buffer, bufferCount,expand, filter, map,  share, tap, withLatestFrom,timestamp} from 'rxjs/operators';
import { interval } from "rxjs";
import { fromPromise } from "rxjs/internal-compatibility";
import {loadImage,loadLevel} from "./loaders";


function fps(v) {
    return interval(1000 / v,animationFrameScheduler)  ;
}
var dom = {};

let imageObservable =  fromPromise(loadImage("public/img/tiles.png"));
let levelLoaders =  fromPromise(loadLevel("public/1-1.json"));
forkJoin(imageObservable,levelLoaders).subscribe(function(results){
    console.log(results);
    
});
//withForkJoin()


// fps(60).subscribe({
//     next:function(r){
//        console.log(r);
//     }
// });

function fps2(v) {
    return interval(1000 / v).pipe(
      timestamp(),
      bufferCount(2, 1)
      ,map(function (w) { 
          return w[1].timestamp - w[0].timestamp; })
      ,share());
}
fps2(60).pipe(map(function (t) { return t / 20; })).subscribe(function(d){
    console.log(d);
});
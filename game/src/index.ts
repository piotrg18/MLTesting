import SpriteSheet from "./SpriteSheet";
import {  Observable,of,animationFrameScheduler, forkJoin, from, BehaviorSubject  } from 'rxjs';
import { buffer, bufferCount,expand, filter, map,  share, tap, withLatestFrom,timestamp} from 'rxjs/operators';;
import { fromPromise } from "rxjs/internal-compatibility";
import {loadImage,loadLevel} from "./loaders";
import { frames$, keysDownPerFrame$ } from "./Utils";
import { InitialData } from "./InitialData";




var dom = {};


let imageObservable =  from(loadImage("public/img/tiles.png"));
let levelLoaders =  from(loadLevel("public/1-1.json"));
let initData = imageObservable.pipe(
            withLatestFrom(levelLoaders),
            map(([image,level]) =>  { return new InitialData(image,level)}));

const gameArea: HTMLElement= document.getElementById('screen');

const context = (gameArea as HTMLCanvasElement).getContext('2d');


function drawBackground(background, context, sprites) {
    background.ranges.forEach(([x1, x2, y1, y2]) => {
        for (let x = x1; x < x2; ++x) {
            for (let y = y1; y < y2; ++y) {
                sprites.drawTile(background.tile, context, x, y);
            }
        }
    });
} 

const update = (deltaTime: number, state: any, inputData: any): any => {
    //console.log("update");

   // console.log(initData);
};



const render = (state: any, initData:InitialData) => {
   // console.log("render");
    initData.levels.backgrounds.forEach(bg => {
        drawBackground(bg, context,initData.sprites);
    }); 


}

const gameState$ = new BehaviorSubject({});


initData.subscribe((initData) =>
 {
    frames$.pipe(
        withLatestFrom(gameState$),
        map(([deltaTime,gameState]) => update(deltaTime,gameState, undefined)),
        tap((gameState) => gameState$.next(gameState))
    )
    .subscribe((gameState) => {
        render(gameState, initData);
    });
    
 });


// fps(60).subscribe({
//     next:function(r){
//        console.log(r);
//     }
// });

// function fps2(v) {
//     return interval(1000 / v).pipe(
//       timestamp(),
//       bufferCount(2, 1)
//       ,map(function (w) { 
//           return w[1].timestamp - w[0].timestamp; })
//       ,share());
// }
// fps2(60).pipe(map(function (t) { return t / 20; })).subscribe(function(d){
//     console.log(d);
// });


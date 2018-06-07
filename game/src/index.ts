import SpriteSheet from "./SpriteSheet";
import {  Observable,of,animationFrameScheduler, forkJoin, from, BehaviorSubject  } from 'rxjs';
import { buffer, bufferCount,expand, filter, map,  share, tap, withLatestFrom,timestamp} from 'rxjs/operators';;
import { fromPromise } from "rxjs/internal-compatibility";
import {loadImage,loadLevel} from "./loaders";
import { frames$, keysDownPerFrame$ } from "./Utils";
import { Compositor } from "./InitialData";
import { Vector } from "./Vector";
import { Entity } from "./Entity";




var dom = {};


let imageObservable =  from(loadImage("public/img/tiles.png"));
let marioObservable =  from(loadImage("public/img/characters.gif"));
let levelLoaders =  from(loadLevel("public/1-1.json"));



let loadedFiles =  forkJoin(imageObservable,levelLoaders,marioObservable)
                                    .pipe( 
                                        map(([image,level,marioImage]) =>  { return new Compositor(image,level,marioImage)}));

const gameArea: HTMLElement= document.getElementById('screen');

const context = (gameArea as HTMLCanvasElement).getContext('2d');

const gravity = 0.5;


const update = (deltaTime: number, state: Entity, inputData: any): any => {
  
    let mario = state["mario"] ;
    mario.pos.x += mario.vel.x;
    mario.pos.y += mario.vel.y;
    mario.vel.y += gravity;
    state['mario'] = mario;


   // console.log(initData);
   return state;
};



const render = (state: any, initData:Compositor) => {

    initData.draw(context, initMario['mario']);
    
}

let initMario =  new Entity();
initMario.pos.set(64,180);
initMario.vel.set(2,-10);
initMario['mario'] = initMario;

const gameState$ = new BehaviorSubject<Entity>(initMario);


loadedFiles.subscribe((initData) =>
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


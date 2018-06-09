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

const gravity = 2000;


export class Trait {
    NAME: string;
    constructor(name) {
        this.NAME = name;
    }

    update(entity:Entity, deltaTime) {
        console.warn('Unhandled update call in Trait');
    }
}

class Velocity extends Trait{
    constructor(){
        super('velocity');
    }
    update(entity:Entity, deltaTime) {
        entity.pos.x += entity.vel.x * deltaTime;
        entity.pos.y += entity.vel.y * deltaTime;
    }
}

class Jump extends Trait {
    engageTime: number;
    velocity: number;
    duration: number;
    constructor(){
        super('jump')
        this.duration = 0.5;
        this.velocity = 200;
        this.engageTime = 0;
    }
    startJump() {
        this.engageTime = this.duration;
    }
    update(entity:Entity,deltaTime){
        if(this.engageTime > 0){
            entity.vel.y = -this.velocity;
            this.engageTime -= deltaTime 
        }
    }
    cancelJump(){
        this.engageTime = 0;
    }
}


const update = (deltaTime: number, state: Entity, inputState: any): any => {

    //console.log(inputState);
    
    console.log(state);
    if(inputState.spacebar !== undefined ){
         state['jump'].startJump();
    }
    else{
        state['jump'].cancelJump();
        
    }
    state.update((1/60));

    state.vel.y += gravity * (1/60);
    //state['mario'] = maro;
    
    //console.log(inputState);

   // console.log(initData);
   return state;
};



const render = (state: any, initData:Compositor) => {

    initData.draw(context, state);
    
}

let initMario =  new Entity();
initMario.pos.set(64,100);

initMario.addTrait(new Velocity());
initMario.addTrait(new Jump());


const gameState$ = new BehaviorSubject<Entity>(initMario);


loadedFiles.subscribe((initData) =>
 {

    frames$.pipe(
        withLatestFrom(gameState$, keysDownPerFrame$),
        map(([deltaTime,gameState, inputState]) => update(deltaTime,gameState, inputState)),
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


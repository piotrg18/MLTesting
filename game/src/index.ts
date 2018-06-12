import SpriteSheet from "./SpriteSheet";
import {  Observable,of,animationFrameScheduler, forkJoin, from, BehaviorSubject  } from 'rxjs';
import { buffer, bufferCount,expand, filter, map,  share, tap, withLatestFrom,timestamp, switchMap, zip} from 'rxjs/operators';;
import {loadImage,loadLevel, loadJSON} from "./loaders";
import { frames$, keysDownOrUpPerFrame$ } from "./Utils";
import { Compositor } from "./InitialData";
import { Vector } from "./Vector";
import { Entity } from "./Entity";
import {Jump} from "./behaviour/jump"
import {Velocity} from "./behaviour/velocity"
import {Go} from "./behaviour/Go"
import Camera from "./Camera";



var dom = {};


let imageObservable =  from(loadImage("public/img/tiles.png"));
let marioObservable =  from(loadImage("public/img/characters.gif"));
let levelLoaders =  from(loadLevel("public/1-1.json"));

let initMario =  new Entity();
initMario.size.set(14, 16);
initMario.pos.set(64,100);

initMario.addTrait(new Go());
//initMario.addTrait(new Velocity());
initMario.addTrait(new Jump());




// let loadedFiles =  forkJoin(imageObservable,levelLoaders,marioObservable)
//                                     .pipe( 
//                                         map(([image,level,marioImage]) =>  { return new Compositor(image,level,marioImage,initMario)}));

const gameArea: HTMLElement= document.getElementById('screen');

const context = (gameArea as HTMLCanvasElement).getContext('2d');


const camera  = new Camera();

window['camera'] = camera;


let levelLoader = levelLoaders.pipe(
    switchMap(res => 
    {
        const spriteSheet = res.spriteSheet;
        return from(loadJSON(`/public/${spriteSheet}.json`)).pipe(map(t => {
            return {level:res, sprites:t };
        }))
    }),
    switchMap(sheetSpec => {
        let imageUrl = sheetSpec.sprites.imageURL
        return from(loadImage(`${imageUrl}`)).pipe(
            map(image => {
                const sprites = new SpriteSheet(
                    image,
                    sheetSpec.sprites.tileW,
                    sheetSpec.sprites.tileH);
        
                sheetSpec.sprites.tiles.forEach(tileSpec => {
                    sprites.defineTile(
                        tileSpec.name,
                        tileSpec.index[0],
                        tileSpec.index[1]);
                });
                return  {  spriteSheet : sprites, mainLevel: sheetSpec.level };
            })
        );   
    })
    
   
);


let loadedAll =  forkJoin(levelLoader,marioObservable)
.pipe(map( ([levelDetails,marioImage]) => {

    return new Compositor(levelDetails,marioImage,initMario);
}));



const update = (deltaTime: number, state: Entity, inputState: any, initData:any): any => {

    //console.log(inputState);
    
    //console.log(state);

    if(inputState.spacebar == 1 ){
         state['jump'].start();
    }
    else if(inputState.spacebar == 0){
        state['jump'].cancel();
        
    }
   
    if(inputState.right_arrow !== undefined){
        state['go'].dir = inputState.right_arrow;
    }
    else if(inputState.left_arrow !== undefined){
        state['go'].dir = -inputState.left_arrow;
    }
    
    if(state.pos.x > 100){
        camera.pos.x = state.pos.x - 100;
    }

    initData.level.update((1/60));
   
    return state;
};



const render = (state: any, initData:Compositor) => {

    initData.draw(context, state, camera );
    
}




const gameState$ = new BehaviorSubject<Entity>(initMario);


loadedAll.subscribe((initData) =>
 {

    frames$.pipe(
        withLatestFrom(gameState$, keysDownOrUpPerFrame$),
        map(([deltaTime,gameState, inputState]) => update(deltaTime,gameState, inputState,initData)),
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


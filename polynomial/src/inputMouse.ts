import { fromEvent, Observable, of,merge } from "rxjs";
import {  expand, filter, map, share, buffer, mergeMap, takeUntil, tap } from "rxjs/operators";

const PRESSED = 1;
const RELEASED = 0;

class FrameData{
    constructor(public frameStartTime:number, public deltaTime:number){
    }
}

export const frames$ = of(undefined)
  .pipe(
    expand((val) => calculateStep(val)),
    filter( frame => frame !== undefined),
    map((frame:FrameData) => frame.deltaTime),
    share()
);

export const calculateStep: (prevFrame: FrameData) => Observable<FrameData> = (prevFrame: FrameData) => {
    return Observable.create((observer) => {       
      requestAnimationFrame((frameStartTime) => {      
        // Millis to seconds
        const deltaTime = prevFrame ? (frameStartTime - prevFrame.frameStartTime) / 1000 : 0;
        observer.next(new FrameData(frameStartTime,deltaTime));
      })
    })
  };

const move$ = fromEvent(document, 'mousemove');

const mouseDown$ = fromEvent(document, 'mousedown');
const mouseUp$ = fromEvent(document, 'mouseup');

const tempMouseAction =  merge(mouseUp$, mouseDown$);

export class MouseVector{
    constructor(public state:number,public x:number, public y:number){}
}


const paints$ = mouseDown$.pipe(
    mergeMap(down => move$.pipe(takeUntil(mouseUp$))
  ));



const mouseDownorUp$ = merge(paints$,mouseUp$)
  .pipe(
    map((event: MouseEvent) => {

      const mouseState = event.type === 'mouseup' ? RELEASED : PRESSED;   
      //console.log(event.type)
      return new MouseVector(mouseState, event.x, event.y);
    }),
    filter((keyMap) => keyMap !== undefined)
  );
  

export const keysDownOrUpPerFrame$ = mouseDownorUp$
.pipe(
  buffer(frames$),
  map((frames: Array<any>) => {
    return frames.reduce((acc, curr) => {
      return Object.assign(acc, curr);
    }, {});
  })
);

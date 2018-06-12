import { Observable,of, BehaviorSubject, fromEvent, merge} from "rxjs";
import { FrameData } from "./frame.interface";
import { buffer, bufferCount,expand, filter, map,  share, tap, withLatestFrom,timestamp, groupBy, distinctUntilChanged} from 'rxjs/operators';
import { KeyUtil } from "./keyUtils";

const PRESSED = 1;
const RELEASED = 0;


export const clampTo30FPS = (frame: FrameData) => {
    if(frame.deltaTime > (1/30)) {
       frame.deltaTime = 1/30;
     }
     return frame;
   }

export const calculateStep: (prevFrame: FrameData) => Observable<FrameData> = (prevFrame: FrameData) => {
    return Observable.create((observer) => { 
      
      requestAnimationFrame((frameStartTime) => {      
        // Millis to seconds
        const deltaTime = prevFrame ? (frameStartTime - prevFrame.frameStartTime) / 1000 : 0;

        observer.next(new FrameData(frameStartTime,deltaTime));
      })
    })
    .pipe(
      map(clampTo30FPS)
    )
  };

  export const frames$ = of(undefined)
  .pipe(
    expand((val) => calculateStep(val)),
    filter( frame => frame !== undefined),
    map((frame:FrameData) => frame.deltaTime),
    share()
  );

const keyUp$ = fromEvent(document, 'keyup');
const keyDown$ = fromEvent(document, 'keydown');

const tempKeyAction =  merge(keyDown$,keyUp$);

const keysDownorUp$ = tempKeyAction
  .pipe(
    map((event: KeyboardEvent) => {
      const name = KeyUtil.codeToKey(''+event.keyCode);
      const keyState = event.type === 'keydown' ? PRESSED : RELEASED;   
      if (name !== ''){
        let keyMap = {};
        keyMap[name] = keyState;
        return keyMap;
      } else {
        return undefined;
      }      
    }),
    filter((keyMap) => keyMap !== undefined)
  );
  

  export const keysDownOrUpPerFrame$ = keysDownorUp$
  .pipe(
    buffer(frames$),
    map((frames: Array<any>) => {
      return frames.reduce((acc, curr) => {
        return Object.assign(acc, curr);
      }, {});
    })
  );


  
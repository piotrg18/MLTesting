import SpriteSheet from "./SpriteSheet";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable,of,animationFrameScheduler } from 'rxjs';
import { Scheduler ,  } from "rxjs/Scheduler";
import { fromEvent } from 'rxjs/observable/fromEvent';
import { buffer, bufferCount,expand, filter, map,  share, tap, withLatestFrom } from 'rxjs/operators';
import { interval } from "rxjs";




var dom = {};

of("1","2").pipe(share()).subscribe(function(d){
    console.log(d);
});



function fps(v) {
    return interval(1000 / v,animationFrameScheduler)  ;
}

fps(60).subscribe({
    next:function(r){
       console.log("dsad");
    }
});
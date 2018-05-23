let y2:number;
let previous:Boolean = false;
export class Random {
    
    random(min?, max?):any{
        let  rand = Math.random();
        if (arguments.length === 0) {
          return rand;
        } else
        if (arguments.length === 1) {
          if (arguments[0] instanceof Array) {
            return arguments[0][Math.floor(rand * arguments[0].length)];
          } else {
            return rand * min;
          }
        } else {
          if (min > max) {
            var tmp = min;
            min = max;
            max = tmp;
          }
      
          return rand * (max-min) + min;
        }
    }
    randomGaussian(mean?, sd?):any {
        let y1,x1,x2,w;
        if (previous) {
          y1 = y2;
          previous = false;
        } else {
          do {
            x1 = this.random(2) - 1;
            x2 = this.random(2) - 1;
            w = x1 * x1 + x2 * x2;
          } while (w >= 1);
          w = Math.sqrt((-2 * Math.log(w))/w);
          y1 = x1 * w;
          y2 = x2 * w;
          previous = true;
        }
      
        var m = mean || 0;
        var s = sd || 1;
        return y1*s + m;
      }
      
}
import { Player } from "./player";

export class Obstacle {
    private spacing:number = 175;
    private w:number = 80;
    private speed:number;
    private bottom:number;
    private x:number;
    private top:number;
    private highlight:boolean;
    
    constructor(height:number, width:number, randomFunc: (start: number, stop: number) => number){
        this.top = randomFunc(height / 6, 3 / 4 * height);
        this.bottom = height - (this.top + this.spacing);
        this.x = width;
        this.w = 80;
        this.speed = 6;
        this.highlight = false;
    }

    show(p:any, height:number):void {
        p.fill(255);
        if (this.highlight) {
          p.fill(255, 0, 0);
        }
        p.rect(this.x, 0, this.w, this.top);
        p.rect(this.x, height-this.bottom, this.w, this.bottom);
    }
    

    hits(player: Player, height:number):boolean {
        let x = player.getX();
        let y = player.getY();
        if (y < this.top || y > height - this.bottom) {
            if (x > this.x && x < this.x + this.w) {
              this.highlight = true;
              return true;
            }
        }
        this.highlight = false;
        return false;
    }

    update(): void {
        this.x -= this.speed;
    }

    offscreen() : boolean {
        if (this.x < -this.w) {
          return true;
        } else {
          return false;
        }
    }


}
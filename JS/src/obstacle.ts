import { Player } from "./player";

export class Obstacle {
    private spacing:number = 145;
    private w:number = 80;
    private speed:number;
    private bottom:number;
    x:number;
    private top:number;
    private highlight:boolean;
    
    constructor(height:number, width:number, randomFunc: (start: number, stop: number) => number){
        let centery = randomFunc(this.spacing, height - this.spacing);
        this.top = centery - this.spacing / 2;
        this.bottom = height - (centery + this.spacing / 2);
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
        if ((player.getY() - player.r) < this.top || (player.getY() + player.r) > (height - this.bottom)) {
            if (player.getX() > this.x && player.getX() < this.x + this.w) {
              return true;
            }
          }
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
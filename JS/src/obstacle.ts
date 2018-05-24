import { Player } from "./player";

export class Obstacle {
    heightWindow: number;
    y: number;
    right: number;
    left: number;
    private spacing:number = 180;
    w:number = 80;
    private speed:number;

    private highlight:boolean;
    
    constructor(height:number, width:number, randomFunc: (start: number, stop: number) => number){
        this.heightWindow = height;
        let centerx = randomFunc(this.spacing, width - this.spacing);
        this.left = centerx - this.spacing / 2;
        this.right = width - (centerx + this.spacing / 2);
        this.y = 0;
        this.w = 80;
        this.speed = 6;
        this.highlight = false;
    }

    show(p:any):void {
        p.fill(255);
        p.rect(0,this.y, this.left, this.w);
        p.rect(p.width - this.right,this.y, this.right,this.w);
    }
    

    hits(player: Player, width:number):boolean {

        if((player.getY() > this.y) && (player.getY() < (this.y + this.w))){
            if (((player.getX()) < this.left) || (player.getX() + player.width) > (width - this.right)) {
                //console.log("hit");
                return true;
            }    
        }
        return false;
    }

    update(): void {
        this.y += this.speed;
    }

    offscreen() : boolean {
        if (this.y > this.heightWindow) {
          return true;
        } else {
          return false;
        }
    }


}
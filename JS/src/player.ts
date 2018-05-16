export class Player {
    _x:number;
    _y:number;

    gravity:number = 0.7;
    lift:number = -12;
    velocity:number = 0;
    constructor(size:number){
        this._x = 64;
        this._y = size / 2;
    }
    draw(p5:any) :void {
        p5.fill(255);
        p5.ellipse(this._x, this._y, 32, 32);
        //let d = random(4);
    }
    move(): void {
        this.velocity += this.lift;
    }
    update(height:number): void 
    {
        this.velocity += this.gravity;
        this._y += this.velocity;

        if (this._y > height) {
            this._y = height;
            this.velocity = 0;
        }

        if (this._y < 0) {
            this._y = 0;
            this.velocity = 0;
        }

    }

}
 





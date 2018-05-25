import { NeuralNetwork } from "./neuralnetwork";
import { Obstacle } from "./obstacle";
import { INeuralNetwork } from "./INeuralNetwork";
import { CustomNeuralNetwork } from "./CustomNeuralNetwork";

export class Player {
    
    width: number;
    height: number;
    size: number;
    nn: INeuralNetwork;
    fitness: number;
    score: number;
    private _x:number;
    private _y:number;
    r:number = 16;


    constructor(size:number ){
        this._x = size / 2;
        this.size = size;
        
        this.score = 0;
        this.fitness = 0;
        this.height = this.r*4;
        this.width = this.r;
        this._y = size - this.height -2;
    }

    draw(p5:any) :void {
        p5.fill(255);

        p5.rect(this._x, this._y, this.width, this.height);
     
    }

    newNeurualNetwork():void{
        this.nn = new CustomNeuralNetwork(5,8,2);
    }

    copy(size:number, p5:any):Player{
        let p = new Player(size);
        p.nn = this.nn.copy();
        return p;
    }
    
    move(): void {
       // this.velocity += this.lift;
    }

    
    hitLeftOrRight(width): Boolean {
        return ((this._x + this.width) > width || this._x < 0);
    }

    getX():number{
        return this._x;
    }
    
    getY():number{
        return this._y;
    }
    
    private map(n:number, start1:number, stop1:number, start2:number, stop2:number) :number{
        return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
    }

    think(obstacles:Array<Obstacle>,height:number ,width :number){
        let record = Infinity;
        let closest  = null;
        //to change and replace with reduce
        obstacles.forEach(o => { 
            let diff = this._y - o.y;
            if (diff > 0 && diff < record) {
              record = diff;
              closest = o;
            }
        });
        if (closest != null) {
            //console.log("near");
            // Now create the inputs to the neural network
            let inputs = [];
            // x position of closest pipe
            inputs[0] = this.map(closest.y + closest.w, this._y, height, 0, 1);
            // top of closest pipe opening
            inputs[1] = this.map(closest.left + closest.w, closest.left, width, 0, 1);
            // bottom of closest pipe opening
            inputs[2] = this.map(closest.right+ closest.w ,closest.right, width, 0, 1);
            // bird's y position
            //inputs[2] = this.map(this._y, 0, height, 0, 1);
            // bird's y velocity
            inputs[3] = this.map(this._x, 0, width, 0, 1);
            inputs[4] = this.map(this._x + this.width,this._x, width, 0, 1);
        
            // Get the outputs from the network
            let action = this.nn.predict(inputs);
            // Decide to jump or not!
            if (action[1] > action[0]) {
                //console.log("turn left");
                this.moveLeft();
            }
            else {
                //console.log("turn rigtht");
                this.moveRight();
            }
        }

    }

    moveRight(): any {
        this._x +=2;
    }
    moveLeft(): any {
        this._x -=2;
    }

    update(height:number): void 
    {
        //this.velocity += this.gravity;
        //this._y -= 0.8;

        this.score++;

    }

}
 





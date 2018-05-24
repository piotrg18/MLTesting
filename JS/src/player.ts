import { NeuralNetwork } from "./neuralnetwork";
import { Obstacle } from "./obstacle";
import { INeuralNetwork } from "./INeuralNetwork";
import { CustomNeuralNetwork } from "./CustomNeuralNetwork";

export class Player {
    size: number;
    nn: INeuralNetwork;
    fitness: number;
    score: number;
    private _x:number;
    private _y:number;
    r:number = 16;
    gravity:number = 0.8;
    lift:number = -12;
    velocity:number = 0;


    constructor(size:number){
        this._x = 64;
        this.size = size;
        this._y = size / 2;
        this.score = 0;
        this.fitness = 0;
    }

    draw(p5:any) :void {
        p5.fill(255);
        p5.ellipse(this._x, this._y, this.r*2, this.r*2);
     
    }

    newNeurualNetwork():void{
        this.nn = new CustomNeuralNetwork(5,16,2);
    }

    copy(size:number, p5:any):Player{
        let p = new Player(size);
        p.nn = this.nn.copy();
        return p;
    }
    
    move(): void {
        this.velocity += this.lift;
    }

    
    bottomTop(): Boolean {
        return (this._y > this.size || this._y < 0);
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

    think(obstacles:Array<Obstacle>){
        let record = Infinity;
        let closest  = null;
        //to change and replace with reduce
        obstacles.forEach(o => { 
            let diff = o.x - this._x;
            if (diff > 0 && diff < record) {
              record = diff;
              closest = o;
            }
        });
        let height = 480;
        let width = 640;
        if (closest != null) {
            // Now create the inputs to the neural network
            let inputs = [];
            // x position of closest pipe
            inputs[0] = this.map(closest.x, this._x, width, 0, 1);
            // top of closest pipe opening
            inputs[1] = this.map(closest.top, 0, height, 0, 1);
            // bottom of closest pipe opening
            inputs[2] = this.map(closest.bottom, 0, height, 0, 1);
            // bird's y position
            inputs[3] = this.map(this._y, 0, height, 0, 1);
            // bird's y velocity
            inputs[4] = this.map(this.velocity, -5, 5, 0, 1);
        
            // Get the outputs from the network
            let action = this.nn.predict(inputs);
            // Decide to jump or not!
            if (action[0] > 0.5) {
                this.move();
            }
        }

    }

    update(height:number): void 
    {
        this.velocity += this.gravity;
        this._y += this.velocity;

        this.score++;

    }

}
 





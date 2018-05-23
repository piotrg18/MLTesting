import { Obstacle } from "./obstacle";
import { Player } from "./player";
import { Random } from "./Random";

export class Game {
    randomHelper: Random;
    p5: any;
    counter: number;
    pipes:Array<Obstacle>;
    allPlayers:Array<Player>;
    activePlayers:Array<Player>;
    population:number = 200;
    constructor(height:number, width:number, p5:any){
        this.pipes = new Array();
        this.activePlayers = new Array<Player>();
        this.allPlayers = new Array<Player>();
        this.p5 = p5;
        this.randomHelper = new Random();
        this.initPopulation(height);    
        this.pipes.push(new Obstacle(p5.height,p5.width, p5.random));
    }

    private initPopulation(height: number):void{
        for(let  i = 0 ; i < this.population ; i++){
            let player = new Player(height);
            player.newNeurualNetwork();
            this.allPlayers[i] = player;
            this.activePlayers[i] = player;
        }
    }
    
    resetGame():void{
        this.counter = 0;
        this.pipes = [];
        this.pipes.push(new Obstacle(this.p5.height,this.p5.width, this.p5.random));
    }
    generate(players: Array<Player>): any {
        let newPlayers = [];
        let randomHelper = this.randomHelper;
        let  mutateInternal=  (x) => {
            if (randomHelper.random(1) < 0.1) {
              let offset = randomHelper.randomGaussian() * 0.5;
              let newx = x + offset;
              return newx;
            } else {
              return x;
            }
        }

        for (let i = 0; i < players.length; i++) {
            // Select a player based on score
            let player = this.poolSelection(players, this.p5.height);
            //mutation
            player.nn.mutate(mutateInternal);
            newPlayers[i] = player;
        }
        return newPlayers;
    }
    nextGeneration():void{
        this.resetGame();
        this.allPlayers = this.normalizeScore(this.allPlayers);
        this.activePlayers = this.generate(this.allPlayers);
        this.allPlayers = this.activePlayers.slice();
    }

    draw(p5:any):void{
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            this.pipes[i].update();
            if (this.pipes[i].offscreen()) {
                this.pipes.splice(i, 1);
            }
        }
        for (let i = this.activePlayers.length - 1; i >= 0; i--) {
            let player = this.activePlayers[i];
            player.think(this.pipes);
            player.update(p5.height);
            for (let j = 0; j < this.pipes.length; j++) {
                if(this.pipes[j].hits(this.activePlayers[i], p5.height)) {
                    this.activePlayers.splice(i, 1);
                    break;
                }
            }
            if (player.bottomTop()) {
                this.activePlayers.splice(i, 1);
            }
        }    
        if (p5.frameCount % 75 == 0) {
            this.pipes.push(new Obstacle(p5.height,p5.width, p5.random));
        }

        this.pipes.forEach((p) => {p.show(p5, p5.height);});

        this.activePlayers.forEach((p) => {p.draw(p5);});
          // If we're out of birds go to the next generation
        if (this.activePlayers.length == 0) {
            this.nextGeneration();
        }
        
    }
    normalizeScore(players:Array<Player>):Array<Player>{
        for (let i = 0; i < players.length; i++) {
            players[i].score = Math.pow(players[i].score, 2);
        }

        let allScores = players.map((a) => a.score);
        let maxScore = allScores.reduce((acc,current)=> {
            return acc + current;
        });

        for(let i = 0 ; i < players.length; i ++){
            players[i].fitness = players[i].score / maxScore;
        }
        
        return players;
    }
    poolSelection(players:Array<Player>, height:number):Player{
        let index = 0;
        let r = this.p5.random(1);

        while (r > 0) {
            r -= players[index].fitness;
            index += 1;
        }
        index -= 1;
        return players[index].copy(height, this.p5);
    }

}
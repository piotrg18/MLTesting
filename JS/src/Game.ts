import { Obstacle } from "./obstacle";
import { Player } from "./player";

export class Game {
    pipes:Array<Obstacle>;
    constructor(height:number, width:number, random:any){
        this.pipes = new Array();
        this.pipes.push(new Obstacle(height, width, random));
    }

    draw(p5:any, player:Player):void{
        for (var i = this.pipes.length-1; i >= 0; i--) {
            this.pipes[i].show(p5, p5.height);
            this.pipes[i].update();
        
            if (this.pipes[i].hits(player, p5.height)) {
                console.log("HIT");
            }
        
            if (this.pipes[i].offscreen()) {
                this.pipes.splice(i, 1);
            }
        }
        
        player.update(p5.height);
        player.draw(p5);
    
        if (p5.frameCount % 75 == 0) {
            this.pipes.push(new Obstacle(p5.height,p5.width, p5.random));
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

        let tmpPlayers =  players.map((p) => {p.fitness = (p.fitness / maxScore);return p;} );
        return tmpPlayers;
    }
}
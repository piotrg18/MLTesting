
let Population = 300
let DeltaDisjoint = 2.0
let DeltaWeights = 0.4
let DeltaThreshold = 1.0

let StaleSpecies = 15

let MutateConnectionsChance = 0.25
let PerturbChance = 0.90
let CrossoverChance = 0.75
let LinkMutationChance = 2.0
let NodeMutationChance = 0.50
let BiasMutationChance = 0.40
let StepSize = 0.1
let DisableMutationChance = 0.4
let EnableMutationChance = 0.2
let Outputs = 3;
let MaxNodes = 1000000;

let sigmoid = (x:number) => {
    return 2/(1 + Math.exp(-4.9 * x)) -1;
}
enum TYPE {
    INPUT,
    HIDDEN,
    OUTPUT
}

class Gene{
    inNode: number;
    outNode: number;
    weight: number;
    expressed: boolean;
    innovation: number;
    constructor(inNode:number, outNode:number, weight:number,expressed:boolean, innovation:number) {
		this.inNode = inNode;
		this.outNode = outNode;
		this.weight = weight;
		this.expressed = expressed;
		this.innovation = innovation;
    }
    setFrom(con:Gene) {
		this.inNode = con.inNode;
		this.outNode = con.outNode;
		this.weight = con.weight;
		this.expressed = con.expressed;
		this.innovation = con.innovation;
    }
    copy(){
        return new Gene(this.inNode, this.outNode, this.weight, this.expressed, this.innovation);
    }
}
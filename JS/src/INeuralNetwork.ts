export interface INeuralNetwork{
    copy(): INeuralNetwork;
    predict(inputs:Array<number>):Array<number>;
    mutate( func:(element:number,i: number,j: number) => number):void;
}
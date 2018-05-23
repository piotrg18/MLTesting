import { INeuralNetwork } from "./INeuralNetwork";


class Matrix<Type> {
    rows: number;
    cols: number;
    data: Type [][];
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.data = Array(this.rows).fill(0).map(() => Array(this.cols).fill(0));
    }
    copy():Matrix<Type> {
        let m = new Matrix<Type>(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.cols; j++) {
            m.data[i][j] = this.data[i][j];
          }
        }
        return m;
    }
    
    static fromArray(arr) {
        return new Matrix(arr.length, 1).map((e, i) => arr[i]);
    }

    randomize() {
        return this.map(e => Math.random() * 2 - 1);
    }
    static multiply(a, b) {
        // Matrix product
        if (a.cols !== b.rows) {
            throw "Columns of A must match rows of B.";
        }
        return new Matrix<number>(a.rows, b.cols)
            .map((e, i, j) => {
            // Dot product of values in col
                let sum = 0;
                for (let k = 0; k < a.cols; k++) {
                    sum += a.data[i][k] * b.data[k][j];
                }
                return sum;
            });
    }

    map(func) {
        // Apply a function to every element of matrix
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.cols; j++) {
            let val = this.data[i][j];
            this.data[i][j] = func(val, i, j);
          }
        }
        return this;
    }

    toArray() :Array<number>{
        let arr = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                arr.push(this.data[i][j]);
            }
        }
        return arr;
    }
       
    add(n) {
        if (n instanceof Matrix) {
            if (this.rows !== n.rows || this.cols !== n.cols) {
                throw 'Columns and Rows of A must match Columns and Rows of B.';
            }
            return this.map((e, i, j) => e + n.data[i][j]);
        } else {
            return this.map(e => e + n);
        }
    }
    
}

class ActivationFunction {
    dfunc: any;
    func: any;
    constructor(func) {
      this.func = func;
    }
}

export class CustomNeuralNetwork implements INeuralNetwork {

    activation_function: ActivationFunction;
    setActivationFunction(): any {
        this.activation_function = new ActivationFunction(x => 1 / (1 + Math.exp(-x)));
    }

    weights_ih: Matrix<number>;
    weights_ho: Matrix<number>;
    bias_h: Matrix<number>;
    bias_o: Matrix<number>;
    private output_nodes: number;
    private hidden_nodes: number;
    private input_nodes: number;

    constructor(inputNodes:number , hiddenNodes:number, outputNodes: number){
        this.input_nodes = inputNodes;
        this.hidden_nodes = hiddenNodes;
        this.output_nodes = outputNodes;
        
        this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
        this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
        this.weights_ih.randomize();
        this.weights_ho.randomize();

        this.bias_h = new Matrix(this.hidden_nodes, 1);
        this.bias_o = new Matrix(this.output_nodes, 1);
        this.bias_h.randomize();
        this.bias_o.randomize();

        
        this.setActivationFunction();
    }

    copy(): INeuralNetwork {
        let copy =  new CustomNeuralNetwork(this.input_nodes, this.hidden_nodes, this.output_nodes);
        copy.weights_ih = this.weights_ih.copy();
        copy.weights_ho = this.weights_ho.copy();

        copy.bias_h = this.bias_h.copy();
        copy.bias_o = this.bias_o.copy();
        return copy;
    }

    predict(input_array: number[]) {
        let inputs = Matrix.fromArray(input_array);
        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        // activation function!
        hidden.map(this.activation_function.func);

        // Generating the output's output!
        let output = Matrix.multiply(this.weights_ho, hidden);
        output.add(this.bias_o);
        output.map(this.activation_function.func);

        // Sending back to the caller!
        return output.toArray();
    }

    mutate(func): void {
        this.weights_ih.map(func);
        this.weights_ho.map(func);
        this.bias_h.map(func);
        this.bias_o.map(func);
    }
}
#r "./packages/Accord/lib/net40/Accord.dll"
#r "./packages/Accord.Math/lib/net40/Accord.Math.dll"
#r "./packages/Accord.Math/lib/net40/Accord.Math.Core.dll"
#r "./packages/Accord.Statistics/lib/net40/Accord.Statistics.dll"
#r "./packages/FSharp.Data/lib/net40/FSharp.Data.dll"

open FSharp.Data
open Accord.Statistics.Models.Regression.Linear

type Wines = 
    CsvProvider<
        Sample = "./data/winequality-white.csv",
        Separators = ";",
        Schema = "float,float,float,float,float,float,float,float,float,float,float,float">

let sampleWines = Wines.GetSample().Rows 
let learningData = sampleWines |> Seq.take 1000

let inputs = learningData |> Seq.map( fun x -> x.Alcohol) |> Seq.toArray
let outputs = learningData |> Seq.map( fun x -> x.``Residual sugar``) |> Seq.toArray

let  ols = OrdinaryLeastSquares()

let  regression = ols.Learn(inputs, outputs)
let a = regression.Slope
let b = regression.Intercept
#r "./packages/FSharp.Data/lib/net40/FSharp.Data.dll"
open FSharp.Data

#I "./packages/Newtonsoft.Json/lib/net45/"
#I "./packages/Google.DataTable.Net.Wrapper/lib/"
#r "./packages/XPlot.GoogleCharts/lib/net45/XPlot.GoogleCharts.dll"

open XPlot.GoogleCharts

let initChart = 
    let options = Configuration.Options()
    options.dataOpacity <- 0.20
    options.pointSize <- 10
    options

type Wines = 
    CsvProvider<
        Sample = "./data/winequality-white.csv",
        Separators = ";",
        Schema = "float,float,float,float,float,float,float,float,float,float,float,float">

type WhiteWine = Wines.Row

let options = initChart
let sampleWines = Wines.GetSample().Rows 
 
let learningData = sampleWines |> Seq.take 1000
let testData = sampleWines |> Seq.skip 1000


sampleWines 
    |> Seq.map (fun wine -> wine.Alcohol, wine.``Residual sugar``) 
    |> Chart.Scatter
    |> Chart.WithOptions options
    |> Chart.WithTitle "Quality based on stuff"
    |> Chart.WithXTitle "Amount of stuff"
    |> Chart.WithYTitle "Residual sugar"
    |> Chart.Show

let predictionModel (a:float) (b:float) input =
    input |> Seq.map ( fun x -> a*x + b )


let costFunction (hypothesis:seq<float>) (actualValue:seq<float>) = 

    let sumSquared = (hypothesis, actualValue)  ||> Seq.map2 ( fun hx y -> (hx - y) ** 2.0 ) |> Seq.sum

    let length = hypothesis |> Seq.length |> float
    let average = sumSquared / (length * 2.0) 
    average

let drawCompareChart a b feature =
    let hypothesis = predictionModel a b feature

    let predictedQuality = (feature, hypothesis) ||> Seq.map2 (fun a b -> (a,b)) 
    let actualQuality = sampleWines |> Seq.map (fun wine -> wine.Alcohol, wine.``Residual sugar``)

    [predictedQuality; actualQuality]
    |> Chart.Scatter
    |> Chart.WithOptions options
    |> Chart.WithLabels ["Predicted"; "Actual"]
    |> Chart.Show

let alcoholFeature = learningData |> Seq.map (fun x -> x.Alcohol)
let qualityLabels = learningData |> Seq.map (fun x -> x.``Residual sugar``)


let sampleA = -0.1 
let sampleB = -0.1
let hypothesis = predictionModel sampleA sampleB alcoholFeature

costFunction hypothesis qualityLabels

drawCompareChart sampleA sampleB alcoholFeature


let calculateGradientDecent a b alpha feature actualValue =
    let hypothesis = predictionModel a b feature
    let gradientA =  ( hypothesis ,actualValue) ||> Seq.map2 ( fun hx y -> (hx - y) )  |> Seq.sum
    let gradientB = (hypothesis ,actualValue, feature) |||> Seq.map3 ( fun hx y x -> (hx - y) * x )  |> Seq.sum

    let length = hypothesis |> Seq.length |> float
    let resultGradientA = (gradientA * alpha) / length
    let resultGradientB = (gradientB * alpha) / length
    (resultGradientA, resultGradientB)

let learning alpha steps = 

    let mutable a = -2.0
    let mutable b = -1.8

    for i in 0 .. steps do
        printfn "%f %f" a b

        let (gradientStepA, gradientStepB) = calculateGradientDecent a b alpha alcoholFeature qualityLabels

        a <- a - gradientStepA
        b <- b - gradientStepB
    (a,b)


let (a,b) = learning 0.001 150

let testAlcohoFeature = testData |> Seq.map (fun x -> x.Alcohol)
let testQualityLabels = testData |> Seq.map (fun x -> x.``Residual sugar``)
let testHypothesis = predictionModel a b alcoholFeature
let testCost = costFunction testHypothesis testQualityLabels
drawCompareChart a b testAlcohoFeature
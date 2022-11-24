import { Graph, Sink, Source, Transform } from "./Graph/graph"

export const demoScene = (graph: Graph): void => {
    const start = graph.addNode("num", [50, 50]) as Source
    graph.setValue(start.body, { type: "Number", value: -10 })

    // const stop = graph.addNode("num", [50, 200]) as Source
    // graph.setValue(stop.body, { kind: ValueKind.NUMBER, value: 10 })
    //
    // const step = graph.addNode("num", [50, 350]) as Source
    // graph.setValue(step.body, { kind: ValueKind.NUMBER, value: 10 })
    //
    // const linspace = graph.addNode("linspace", [300, 50]) as Transform
    // graph.addEdge({ output: start.outputs[0], input: linspace.inputs[0] })
    // graph.addEdge({ output: stop.outputs[0], input: linspace.inputs[1] })
    // graph.addEdge({ output: step.outputs[0], input: linspace.inputs[2] })
    //
    // const xLabel = graph.addNode("label", [730, 50]) as Sink
    // graph.setValue(xLabel.body, {
    //     kind: ValueKind.LABEL,
    //     name: "x",
    //     value: { kind: ValueKind.NONE },
    // })
    // graph.addEdge({ output: linspace.outputs[0], input: xLabel.inputs[0] })
    //
    // const three = graph.addNode("num", [50, 550]) as Source
    // graph.setValue(three.body, { kind: ValueKind.NUMBER, value: 3 })
    //
    // const xRead = graph.addNode("read", [50, 700]) as Source
    // graph.setValue(xRead.body, { kind: ValueKind.READ, name: "x" })
    //
    // const five = graph.addNode("num", [300, 550]) as Source
    // graph.setValue(five.body, { kind: ValueKind.NUMBER, value: 5 })
    //
    // const mul = graph.addNode("mul", [300, 700]) as Transform
    // graph.addEdge({ output: three.outputs[0], input: mul.inputs[0] })
    // graph.addEdge({ output: xRead.outputs[0], input: mul.inputs[1] })
    //
    // const add = graph.addNode("add", [530, 550]) as Transform
    // graph.addEdge({ output: five.outputs[0], input: add.inputs[0] })
    // graph.addEdge({ output: mul.outputs[0], input: add.inputs[1] })
    //
    // const yLabel = graph.addNode("label", [800, 550]) as Sink
    // graph.setValue(yLabel.body, {
    //     kind: ValueKind.LABEL,
    //     name: "y",
    //     value: { kind: ValueKind.NONE },
    // })
    // graph.addEdge({ output: add.outputs[0], input: yLabel.inputs[0] })
    //
    // const m = graph.addNode("num", [50, 1100]) as Source
    // graph.setValue(m.body, { kind: ValueKind.NUMBER, value: 1 })
    //
    // const xRead1 = graph.addNode("read", [50, 1250]) as Source
    // graph.setValue(xRead1.body, { kind: ValueKind.READ, name: "x" })
    //
    // const mul1 = graph.addNode("mul", [300, 1250]) as Transform
    // graph.addEdge({ output: m.outputs[0], input: mul1.inputs[0] })
    // graph.addEdge({ output: xRead1.outputs[0], input: mul1.inputs[1] })
    //
    // const b = graph.addNode("num", [300, 1100]) as Source
    // graph.setValue(b.body, { kind: ValueKind.NUMBER, value: 2 })
    //
    // const add1 = graph.addNode("add", [530, 1100]) as Transform
    // graph.addEdge({ output: b.outputs[0], input: add1.inputs[0] })
    // graph.addEdge({ output: mul1.outputs[0], input: add1.inputs[1] })
    //
    // const yHatLabel = graph.addNode("label", [800, 1100]) as Sink
    // graph.setValue(yHatLabel.body, {
    //     kind: ValueKind.LABEL,
    //     name: "y hat",
    //     value: { kind: ValueKind.NONE },
    // })
    // graph.addEdge({ output: add1.outputs[0], input: yHatLabel.inputs[0] })
    //
    // const xRead2 = graph.addNode("read", [1200, 50]) as Source
    // graph.setValue(xRead2.body, { kind: ValueKind.READ, name: "x" })
    //
    // const yRead = graph.addNode("read", [1200, 200]) as Source
    // graph.setValue(yRead.body, { kind: ValueKind.READ, name: "y" })
    //
    // const scatter = graph.addNode("scatter", [1400, 50]) as Transform
    // graph.addEdge({ output: xRead2.outputs[0], input: scatter.inputs[0] })
    // graph.addEdge({ output: yRead.outputs[0], input: scatter.inputs[1] })
    //
    // const xRead3 = graph.addNode("read", [1200, 450]) as Source
    // graph.setValue(xRead3.body, { kind: ValueKind.READ, name: "x" })
    //
    // const yHatRead = graph.addNode("read", [1200, 600]) as Source
    // graph.setValue(yHatRead.body, { kind: ValueKind.READ, name: "y hat" })
    //
    // const line = graph.addNode("line", [1450, 450]) as Transform
    // graph.addEdge({ output: xRead3.outputs[0], input: line.inputs[0] })
    // graph.addEdge({ output: yHatRead.outputs[0], input: line.inputs[1] })
    //
    // const yRead1 = graph.addNode("read", [1200, 850]) as Source
    // graph.setValue(yRead1.body, { kind: ValueKind.READ, name: "y" })
    //
    // const yHatRead1 = graph.addNode("read", [1200, 1000]) as Source
    // graph.setValue(yHatRead1.body, { kind: ValueKind.READ, name: "y hat" })
    //
    // const sub = graph.addNode("sub", [1450, 850]) as Transform
    // graph.addEdge({ output: yRead1.outputs[0], input: sub.inputs[0] })
    // graph.addEdge({ output: yHatRead1.outputs[0], input: sub.inputs[1] })
    //
    // const abs = graph.addNode("abs", [1650, 850]) as Transform
    // graph.addEdge({ output: sub.outputs[0], input: abs.inputs[0] })
    //
    // const mean = graph.addNode("mean", [1850, 850]) as Transform
    // graph.addEdge({ output: abs.outputs[0], input: mean.inputs[0] })
    //
    // const lossLabel = graph.addNode("label", [2100, 850]) as Sink
    // graph.setValue(lossLabel.body, {
    //     kind: ValueKind.LABEL,
    //     name: "loss",
    //     value: { kind: ValueKind.NONE },
    // })
    // graph.addEdge({ output: mean.outputs[0], input: lossLabel.inputs[0] })
}

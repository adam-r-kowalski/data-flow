import { Graph, Transform } from "./Graph/graph"
import { ValueKind } from "./Graph/value"

export const demoScene = (graph: Graph): void => {
    const start = graph.addNode("number", [50, 300])
    graph.setValue(start.body, { kind: ValueKind.NUMBER, value: -10 })
    const stop = graph.addNode("number", [50, 450])
    graph.setValue(stop.body, { kind: ValueKind.NUMBER, value: 10 })
    const step = graph.addNode("number", [50, 600])
    graph.setValue(step.body, { kind: ValueKind.NUMBER, value: 10 })
    const linspace = graph.addNode("linspace", [300, 400]) as Transform
    graph.addEdge({ output: start.outputs[0], input: linspace.inputs[0] })
    graph.addEdge({ output: stop.outputs[0], input: linspace.inputs[1] })
    graph.addEdge({ output: step.outputs[0], input: linspace.inputs[2] })

    const three = graph.addNode("number", [430, 50])
    graph.setValue(three.body, { kind: ValueKind.NUMBER, value: 3 })

    const mul = graph.addNode("mul", [700, 200]) as Transform
    graph.addEdge({ output: three.outputs[0], input: mul.inputs[0] })
    graph.addEdge({ output: linspace.outputs[0], input: mul.inputs[1] })

    const five = graph.addNode("number", [785, 50])
    graph.setValue(five.body, { kind: ValueKind.NUMBER, value: 5 })

    const add = graph.addNode("add", [1050, 250]) as Transform
    graph.addEdge({ output: five.outputs[0], input: add.inputs[0] })
    graph.addEdge({ output: mul.outputs[0], input: add.inputs[1] })

    const scatter = graph.addNode("scatter", [1400, 50]) as Transform
    graph.addEdge({ output: linspace.outputs[0], input: scatter.inputs[0] })
    graph.addEdge({ output: add.outputs[0], input: scatter.inputs[1] })

    const m = graph.addNode("number", [430, 770])
    graph.setValue(m.body, { kind: ValueKind.NUMBER, value: 1 })

    const mul1 = graph.addNode("mul", [700, 700]) as Transform
    graph.addEdge({ output: linspace.outputs[0], input: mul1.inputs[0] })
    graph.addEdge({ output: m.outputs[0], input: mul1.inputs[1] })

    const b = graph.addNode("number", [785, 1100])
    graph.setValue(b.body, { kind: ValueKind.NUMBER, value: 2 })

    const add1 = graph.addNode("add", [1050, 875]) as Transform
    graph.addEdge({ output: mul1.outputs[0], input: add1.inputs[0] })
    graph.addEdge({ output: b.outputs[0], input: add1.inputs[1] })

    const line = graph.addNode("line", [1400, 900]) as Transform
    graph.addEdge({ output: linspace.outputs[0], input: line.inputs[0] })
    graph.addEdge({ output: add1.outputs[0], input: line.inputs[1] })

    const sub = graph.addNode("sub", [1400, 500]) as Transform
    graph.addEdge({ output: add.outputs[0], input: sub.inputs[0] })
    graph.addEdge({ output: add1.outputs[0], input: sub.inputs[1] })

    const abs = graph.addNode("abs", [1750, 500]) as Transform
    graph.addEdge({ output: sub.outputs[0], input: abs.inputs[0] })

    const mean = graph.addNode("mean", [2100, 500]) as Transform
    graph.addEdge({ output: abs.outputs[0], input: mean.inputs[0] })
}

import { Graph, Transform } from "./Graph/graph"
import { ValueKind } from "./Graph/value"

export const demoScene = (graph: Graph): void => {
    const start = graph.addNode("number", [50, 50])
    graph.setValue(start.body, { kind: ValueKind.NUMBER, value: -10 })
    const stop = graph.addNode("number", [50, 200])
    graph.setValue(stop.body, { kind: ValueKind.NUMBER, value: 10 })
    const step = graph.addNode("number", [50, 350])
    graph.setValue(step.body, { kind: ValueKind.NUMBER, value: 10 })
    const linspace = graph.addNode("linspace", [300, 50]) as Transform
    graph.addEdge({ output: start.outputs[0], input: linspace.inputs[0] })
    graph.addEdge({ output: stop.outputs[0], input: linspace.inputs[1] })
    graph.addEdge({ output: step.outputs[0], input: linspace.inputs[2] })
    const square = graph.addNode("square", [650, 450]) as Transform
    graph.addEdge({ output: linspace.outputs[0], input: square.inputs[0] })
    const scatter = graph.addNode("scatter", [1000, 50]) as Transform
    graph.addEdge({ output: linspace.outputs[0], input: scatter.inputs[0] })
    graph.addEdge({ output: square.outputs[0], input: scatter.inputs[1] })
    const line = graph.addNode("line", [1000, 450]) as Transform
    graph.addEdge({ output: linspace.outputs[0], input: line.inputs[0] })
    graph.addEdge({ output: square.outputs[0], input: line.inputs[1] })
}

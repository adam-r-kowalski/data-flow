import { Graph, Transform } from "./graph"
import { ValueKind } from "./value"

export const demoScene = (graph: Graph): void => {
    const start = graph.addNode("number", [50, 50])
    graph.setValue(start.body, { kind: ValueKind.NUMBER, value: -10 })
    const stop = graph.addNode("number", [50, 200])
    graph.setValue(stop.body, { kind: ValueKind.NUMBER, value: 10 })
    const step = graph.addNode("number", [50, 350])
    graph.setValue(step.body, { kind: ValueKind.NUMBER, value: 5 })
    const linspace = graph.addNode("linspace", [400, 50]) as Transform
    graph.addEdge({ output: start.outputs[0], input: linspace.inputs[0] })
    graph.addEdge({ output: stop.outputs[0], input: linspace.inputs[1] })
    graph.addEdge({ output: step.outputs[0], input: linspace.inputs[2] })
}

import { Graph, Transform } from "./graph"
import { ValueKind } from "./value"

export const demoScene = (graph: Graph): void => {
    const node0 = graph.addNode("number", [50, 50])
    graph.setValue(node0.body, { kind: ValueKind.NUMBER, value: 18 })
    const node1 = graph.addNode("number", [50, 200])
    graph.setValue(node1.body, { kind: ValueKind.NUMBER, value: 24 })
    const node2 = graph.addNode("add", [500, 125]) as Transform
    graph.addEdge({ output: node0.outputs[0], input: node2.inputs[0] })
    graph.addEdge({ output: node1.outputs[0], input: node2.inputs[1] })
}

import { createGraph } from "../Graph/graph"
import { DataFlow } from "../DataFlow"

export const Demo = () => {
    const graph = createGraph()
    const start = graph.addNode({ type: "num", data: -10 }, [50, 50])
    const stop = graph.addNode({ type: "num", data: 10 }, [50, 200])
    const step = graph.addNode({ type: "num", data: 10 }, [50, 350])
    const linspace = graph.addNode(
        { type: "call", name: "linspace" },
        [300, 50]
    )
    const xLabel = graph.addNode({ type: "label", name: "x" }, [730, 50])
    graph.addEdge({ node: start.id, input: linspace.inputs[0] })
    graph.addEdge({ node: stop.id, input: linspace.inputs[1] })
    graph.addEdge({ node: step.id, input: linspace.inputs[2] })
    graph.addEdge({ node: linspace.id, input: xLabel.inputs[0] })

    const three = graph.addNode({ type: "num", data: 3 }, [50, 550])
    const xRead = graph.addNode({ type: "read", name: "x" }, [50, 700])
    const five = graph.addNode({ type: "num", data: 5 }, [300, 550])
    const mul = graph.addNode({ type: "call", name: "mul" }, [300, 700])
    const add = graph.addNode({ type: "call", name: "add" }, [530, 550])
    const yLabel = graph.addNode({ type: "label", name: "y" }, [800, 550])
    graph.addEdge({ node: three.id, input: mul.inputs[0] })
    graph.addEdge({ node: xRead.id, input: mul.inputs[1] })
    graph.addEdge({ node: five.id, input: add.inputs[0] })
    graph.addEdge({ node: mul.id, input: add.inputs[1] })
    graph.addEdge({ node: add.id, input: yLabel.inputs[0] })

    const m = graph.addNode({ type: "num", data: 1 }, [50, 1100])
    const xRead1 = graph.addNode({ type: "read", name: "x" }, [50, 1250])
    const mul1 = graph.addNode({ type: "call", name: "mul" }, [300, 1250])
    const b = graph.addNode({ type: "num", data: 2 }, [300, 1100])
    const add1 = graph.addNode({ type: "call", name: "add" }, [530, 1100])
    const yHatLabel = graph.addNode(
        { type: "label", name: "y hat" },
        [800, 1100]
    )
    graph.addEdge({ node: m.id, input: mul1.inputs[0] })
    graph.addEdge({ node: xRead1.id, input: mul1.inputs[1] })
    graph.addEdge({ node: b.id, input: add1.inputs[0] })
    graph.addEdge({ node: mul1.id, input: add1.inputs[1] })
    graph.addEdge({ node: add1.id, input: yHatLabel.inputs[0] })

    const xRead2 = graph.addNode({ type: "read", name: "x" }, [1200, 50])
    const yRead = graph.addNode({ type: "read", name: "y" }, [1200, 200])
    const scatter = graph.addNode({ type: "call", name: "scatter" }, [1400, 50])
    graph.addEdge({ node: xRead2.id, input: scatter.inputs[0] })
    graph.addEdge({ node: yRead.id, input: scatter.inputs[1] })

    const xRead3 = graph.addNode({ type: "read", name: "x" }, [1200, 450])
    const yHatRead = graph.addNode({ type: "read", name: "y hat" }, [1200, 600])
    const line = graph.addNode({ type: "call", name: "line" }, [1450, 450])
    const overlay = graph.addNode({ type: "call", name: "overlay" }, [1900, 50])
    graph.addEdge({ node: xRead3.id, input: line.inputs[0] })
    graph.addEdge({ node: yHatRead.id, input: line.inputs[1] })
    graph.addEdge({ node: scatter.id, input: overlay.inputs[0] })
    graph.addEdge({ node: line.id, input: overlay.inputs[1] })

    const yRead1 = graph.addNode({ type: "read", name: "y" }, [1200, 850])
    const yHatRead1 = graph.addNode(
        { type: "read", name: "y hat" },
        [1200, 1000]
    )
    const sub = graph.addNode({ type: "call", name: "sub" }, [1450, 850])
    const abs = graph.addNode({ type: "call", name: "abs" }, [1650, 850])
    const mean = graph.addNode({ type: "call", name: "mean" }, [1850, 850])
    const lossLabel = graph.addNode(
        { type: "label", name: "loss" },
        [2100, 850]
    )
    graph.addEdge({ node: yRead1.id, input: sub.inputs[0] })
    graph.addEdge({ node: yHatRead1.id, input: sub.inputs[1] })
    graph.addEdge({ node: sub.id, input: abs.inputs[0] })
    graph.addEdge({ node: abs.id, input: mean.inputs[0] })
    graph.addEdge({ node: mean.id, input: lossLabel.inputs[0] })

    return <DataFlow graph={graph} />
}

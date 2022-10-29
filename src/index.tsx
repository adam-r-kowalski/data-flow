import { createSignal, For } from "solid-js"
import { createStore } from "solid-js/store"
import { render } from "solid-js/web"

import { Graph, Nodes, Node, Port, Edges, Edge } from "./graph"
import { Delta } from "./graph/drag"
import * as model from "./model"

const App = () => {
    const [graph, setGraph] = createStore(model.initial(1000))
    const [camera, setCamera] = createSignal({ x: 0, y: 0 })
    const onDragCamera = (delta: Delta) => {
        setCamera({ x: camera().x - delta.dx, y: camera().y - delta.dy })
    }
    const onDragNode = (id: string, delta: Delta) => {
        setGraph("nodes", id, (node) => ({
            ...node,
            x: node.x - delta.dx,
            y: node.y - delta.dy,
        }))
    }
    return (
        <Graph
            width={700}
            height={700}
            style={{ background: "tan", margin: "50px" }}
            onDrag={onDragCamera}
        >
            <Nodes x={camera().x} y={camera().y}>
                <For each={Object.values(graph.nodes)}>
                    {(node) => {
                        return (
                            <Node
                                x={node.x}
                                y={node.y}
                                style={{
                                    background: "cornflowerblue",
                                    padding: "20px",
                                    display: "flex",
                                    gap: "20px",
                                }}
                                onDrag={(delta) => onDragNode(node.uuid, delta)}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        "flex-direction": "column",
                                        gap: "10px",
                                    }}
                                >
                                    <For each={node.inputs}>
                                        {(uuid) => {
                                            const input = graph.inputs[uuid]
                                            return (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        "align-items": "center",
                                                        gap: "10px",
                                                    }}
                                                >
                                                    <Port
                                                        id={input.uuid}
                                                        style={{
                                                            background: "white",
                                                            width: "40px",
                                                            height: "40px",
                                                        }}
                                                    />
                                                    <div>{input.name}</div>
                                                </div>
                                            )
                                        }}
                                    </For>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        "flex-direction": "column",
                                        "align-items": "center",
                                        gap: "10px",
                                    }}
                                >
                                    <div>{node.name}</div>
                                    <div
                                        style={{
                                            background: "white",
                                            padding: "20px",
                                        }}
                                    >
                                        {graph.bodies[node.body].value}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        "flex-direction": "column",
                                        gap: "10px",
                                    }}
                                >
                                    <For each={node.outputs}>
                                        {(uuid) => {
                                            const output = graph.outputs[uuid]
                                            return (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        "align-items": "center",
                                                        gap: "10px",
                                                    }}
                                                >
                                                    <div>{output.name}</div>
                                                    <Port
                                                        id={output.uuid}
                                                        style={{
                                                            background: "white",
                                                            width: "40px",
                                                            height: "40px",
                                                        }}
                                                    />
                                                </div>
                                            )
                                        }}
                                    </For>
                                </div>
                            </Node>
                        )
                    }}
                </For>
            </Nodes>
            <Edges x={camera().x} y={camera().y}>
                <For each={Object.values(graph.edges)}>
                    {(edge) => {
                        return (
                            <Edge from={edge.output} to={edge.input}>
                                {(rects) => {
                                    const data = () => {
                                        const x0 =
                                            rects()[0].x + rects()[0].width / 2
                                        const y0 =
                                            rects()[0].y + rects()[0].height / 2
                                        const x1 = x0 + 50
                                        const x3 =
                                            rects()[1].x + rects()[1].width / 2
                                        const x2 = x3 - 50
                                        const y3 =
                                            rects()[1].y + rects()[1].height / 2
                                        return { x0, y0, x1, x2, x3, y3 }
                                    }
                                    return (
                                        <>
                                            <circle
                                                cx={data().x0}
                                                cy={data().y0}
                                                r={10}
                                                fill="black"
                                            />
                                            <circle
                                                cx={data().x3}
                                                cy={data().y3}
                                                r={10}
                                                fill="black"
                                            />
                                            <path
                                                d={`M${data().x0},${
                                                    data().y0
                                                } C${data().x1},${data().y0} ${
                                                    data().x2
                                                },${data().y3} ${data().x3},${
                                                    data().y3
                                                }`}
                                                stroke="black"
                                                stroke-width={3}
                                                fill="none"
                                            />
                                        </>
                                    )
                                }}
                            </Edge>
                        )
                    }}
                </For>
            </Edges>
        </Graph>
    )
}

render(() => <App />, document.getElementById("root")!)

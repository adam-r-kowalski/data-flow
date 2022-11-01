import { createMemo, For } from "solid-js"
import { createStore } from "solid-js/store"

import { Graph, Nodes, Node, Port, Edges, Edge, Curve } from "./graph"
import * as model from "./model"

export const DataFlow = () => {
    const [graph] = createStore(model.initial(500))
    return (
        <Graph style={{ background: "tan", width: "100%", height: "100%" }}>
            <Nodes>
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
            <Edges>
                <For each={Object.values(graph.edges)}>
                    {(edge) => {
                        return (
                            <Edge from={edge.output} to={edge.input}>
                                {(ports) => {
                                    const data = () => {
                                        const x0 =
                                            ports().from.x +
                                            ports().from.width / 2
                                        const y0 =
                                            ports().from.y +
                                            ports().from.height / 2
                                        const x1 = x0 + 50
                                        const x3 =
                                            ports().to.x + ports().to.width / 2
                                        const x2 = x3 - 50
                                        const y3 =
                                            ports().to.y + ports().to.height / 2
                                        return { x0, y0, x1, x2, x3, y3 }
                                    }
                                    const memoData = createMemo(() => data())
                                    return (
                                        <>
                                            <circle
                                                cx={memoData().x0}
                                                cy={memoData().y0}
                                                r={10}
                                                fill="black"
                                            />
                                            <circle
                                                cx={memoData().x3}
                                                cy={memoData().y3}
                                                r={10}
                                                fill="black"
                                            />
                                            <Curve ports={ports} />
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

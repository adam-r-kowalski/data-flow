import { For } from "solid-js"
import { createStore } from "solid-js/store"

import { Graph, Nodes, Node, Port, Edges, Edge, Curve } from "./graph"
import * as model from "./model"

export const DataFlow = () => {
    const [graph] = createStore(model.initial(1000))
    return (
        <Graph style={{ background: "tan", width: "100vw", height: "100vh" }}>
            <Nodes>
                <For each={Object.values(graph.nodes)}>
                    {(node) => {
                        return (
                            <Node
                                position={node.position}
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
                                    return (
                                        <>
                                            <circle
                                                cx={ports().from.center[0]}
                                                cy={ports().from.center[1]}
                                                r={10}
                                                fill="black"
                                            />
                                            <circle
                                                cx={ports().to.center[0]}
                                                cy={ports().to.center[1]}
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

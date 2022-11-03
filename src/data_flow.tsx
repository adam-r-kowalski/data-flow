import { For } from "solid-js"
import { createStore } from "solid-js/store"

import { Graph, Nodes, Edges, Edge, Curve } from "./graph"
import { NodeCard } from "./node_card"
import * as model from "./model"

export const DataFlow = () => {
    const [graph] = createStore(model.initial(100))
    return (
        <Graph
            style={{
                width: "100vw",
                height: "100vh",
                background: "#24283b",
                "background-size": "40px 40px",
                "background-image":
                    "radial-gradient(circle, #3b4261 1px, rgba(0, 0, 0, 0) 1px)",
            }}
        >
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
                                                fill="#7aa2f7"
                                            />
                                            <Curve
                                                ports={ports}
                                                stroke="#7aa2f7"
                                                stroke-width={4}
                                            />
                                        </>
                                    )
                                }}
                            </Edge>
                        )
                    }}
                </For>
            </Edges>
            <Nodes>
                <For each={Object.values(graph.nodes)}>
                    {(node) => {
                        return (
                            <NodeCard
                                position={node.position}
                                title={node.name}
                                inputs={node.inputs.map(
                                    (id) => graph.inputs[id]
                                )}
                                outputs={node.outputs.map(
                                    (id) => graph.outputs[id]
                                )}
                            >
                                42
                            </NodeCard>
                        )
                    }}
                </For>
            </Nodes>
        </Graph>
    )
}

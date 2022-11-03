import { For } from "solid-js"
import { createStore } from "solid-js/store"

import { Graph, Nodes, Edges, Edge, Curve } from "./graph"
import { NodeCard } from "./node_card"
import * as model from "./model"

export const DataFlow = () => {
    const [graph] = createStore(model.initial(300))
    return (
        <Graph
            style={{ background: "#0093E9", width: "100vw", height: "100vh" }}
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
                                                fill="white"
                                            />
                                            <circle
                                                cx={ports().to.center[0]}
                                                cy={ports().to.center[1]}
                                                r={10}
                                                fill="white"
                                            />
                                            <Curve
                                                ports={ports}
                                                stroke="white"
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

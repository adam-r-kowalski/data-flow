import { createStore } from "solid-js/store"
import { For } from "solid-js"

import { Node, NodeCard } from "./node"

export type Nodes = { [uuid: string]: Node }

const initialNodes = (n: number): Nodes => {
    const nodes: Nodes = {}
    for (let i = 0; i < n; ++i) {
        const inputs: string[] = []
        for (let j = 0; j < Math.floor(Math.random() * 5); ++j) {
            inputs.push(`in ${j}`)
        }
        const outputs: string[] = []
        for (let j = 0; j < Math.floor(Math.random() * 4) + 1; ++j) {
            outputs.push(`out ${j}`)
        }
        nodes[i] = {
            uuid: i.toString(),
            name: `node ${i}`,
            value: Math.floor(Math.random() * 100),
            position: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight,
            ],
            inputs,
            outputs,
        }
    }
    return nodes
}

export const NodeCards = () => {
    const [nodes, setNodes] = createStore(initialNodes(10))
    return (
        <For each={Object.values(nodes)}>
            {(node) => (
                <NodeCard
                    node={node}
                    onDrag={(uuid, delta) => {
                        setNodes(
                            uuid,
                            "position",
                            ([x, y]): [number, number] => [
                                x + delta.x,
                                y + delta.y,
                            ]
                        )
                    }}
                />
            )}
        </For>
    )
}

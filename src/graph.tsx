import { createStore } from "solid-js/store"

import { Nodes } from "./nodes"
import * as nodes from "./nodes"
import { Drag } from "./node"
import { add } from "./vec2"
import { Scene } from "./scene"

interface Graph {
    nodes: Nodes
}

export const initial = (n: number): Graph => {
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
                Math.random() * 5000 - 2500,
                Math.random() * 5000 - 2500,
            ],
            inputs,
            outputs,
        }
    }
    return { nodes }
}

export const View = () => {
    const [graph, setGraph] = createStore(initial(100))
    const onDrag = (drag: Drag) => {
        setGraph("nodes", drag.uuid, "position", (p) => add(p, drag.delta))
    }
    return (
        <>
            <Scene>
                <nodes.View nodes={graph.nodes} onDrag={onDrag} />
            </Scene>
        </>
    )
}

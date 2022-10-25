import { Model } from "./model"
import { Nodes } from "./node"
import { Kind } from "./pointer"

export const bigDemoModel = (n: number): Model => {
    const nodes: Nodes = {}
    for (let i = 0; i < n; ++i) {
        const uuid = `node-${i}`
        nodes[uuid] = {
            uuid,
            name: uuid,
            pos: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight,
            ],
            inputs: [],
            outputs: [{ uuid: `${uuid}-output-0`, name: "out" }],
            value: Math.floor(Math.random() * 100),
        }
    }
    return {
        graph: {
            nodes,
            edges: {},
        },
        camera: { zoom: 1, pos: [0, 0] },
        pointers: { kind: Kind.ZERO },
        window: [window.innerWidth, window.innerHeight],
    }
}

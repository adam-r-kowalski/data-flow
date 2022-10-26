import { Nodes } from "./nodes"

interface Model {
    nodes: Nodes
}

export const initial = (n: number): Model => {
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
                Math.random() * n * 20 - n * 10,
                Math.random() * n * 20 - n * 10,
            ],
            inputs,
            outputs,
        }
    }
    return { nodes }
}

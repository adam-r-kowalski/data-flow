import { HasCamera } from "./camera"
import { add, scale, Vec2 } from "./vec2"

export interface Input {
    uuid: string
    name: string
}

export interface Output {
    uuid: string
    name: string
}

export interface Node {
    uuid: string
    pos: Vec2
    name: string
    inputs: Input[]
    outputs: Output[]
    value: number
}

export type Nodes = { [uuid: string]: Node }

export interface HasNodes {
    nodes: Nodes
}

export interface Drag {
    kind: "node/drag"
    uuid: string
    drag: Vec2
}

export const drag = <M extends HasNodes & HasCamera>(
    model: M,
    { uuid, drag }: Drag
): M => {
    const zoom = model.camera.zoom
    const node = model.nodes[uuid]
    const nodes = {
        ...model.nodes,
        [uuid]: {
            ...node,
            pos: add(node.pos, scale(drag, -1 / zoom)),
        },
    }
    return { ...model, nodes }
}

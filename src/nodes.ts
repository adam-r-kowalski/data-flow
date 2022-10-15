import { Node } from "./node"
import { DragNode } from "./NodeCard"

export type Nodes = { [uuid: string]: Node }

export const moveNode = (nodes: Nodes, drag: DragNode): Nodes => {
    const node = nodes[drag.uuid]
    return {
        ...nodes,
        [node.uuid]: {
            ...node,
            x: node.x + drag.dx,
            y: node.y + drag.dy,
        },
    }
}

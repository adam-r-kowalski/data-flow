import { Node } from "./node"
import { DragNode } from "./NodeCard"

export type Nodes = { [uuid: string]: Node }

export const moveNode = (nodes: Nodes, zoom: number, drag: DragNode): Nodes => {
    const node = nodes[drag.uuid]
    return {
        ...nodes,
        [node.uuid]: {
            ...node,
            x: node.x + drag.dx / zoom,
            y: node.y + drag.dy / zoom,
        },
    }
}

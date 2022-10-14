import { drag } from "./drag"
import { Node } from "./node"

0 && drag

export interface DragNode {
    uuid: string
    dx: number
    dy: number
}

interface Props {
    node: Node
    onDrag: (drag: DragNode) => void
}

export const NodeCard = (props: Props) => (
    <div
        use:drag={({ dx, dy }) =>
            props.onDrag({ uuid: props.node.uuid, dx, dy })
        }
        style={{
            width: "100px",
            height: "100px",
            position: "absolute",
            transform: `translate(${props.node.x}px, ${props.node.y}px)`,
            background: "rgba( 255, 255, 255, 0.25 )",
            "box-shadow": "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
            "backdrop-filter": "blur( 4px )",
            "-webkit-backdrop-filter": "blur( 4px )",
            "border-radius": "10px",
            border: "1px solid rgba( 255, 255, 255, 0.18 )",
        }}
    />
)

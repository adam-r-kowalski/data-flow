import { BoundingBoxes } from "./bounding_boxes"
import { Camera } from "./camera"
import { Edges } from "./edges"
import { Nodes } from "./nodes"
import { Pointers } from "./pointers"
import { Vec2 } from "./vec2"

export interface Model {
    nodes: Nodes
    edges: Edges
    boundingBoxes: BoundingBoxes
    camera: Camera
    pointers: Pointers
    window: Vec2
}

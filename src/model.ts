import { Camera } from "./camera"
import { Edges } from "./edges"
import { Nodes } from "./node"
import { Pointers } from "./pointers"
import { Vec2 } from "./vec2"

export interface Model {
    nodes: Nodes
    edges: Edges
    camera: Camera
    pointers: Pointers
    window: Vec2
}

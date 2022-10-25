import { Camera } from "./camera"
import { Graph } from "./graph"
import { Pointers } from "./pointer"
import { Vec2 } from "./vec2"

export interface Model {
    graph: Graph
    camera: Camera
    pointers: Pointers
    window: Vec2
}

import { Vec2 } from "./vec2"

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

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
    x: number
    y: number
    name: string
    inputs: Input[]
    outputs: Output[]
}

export interface Edge {
    uuid: string
    input: string
    output: string
}

export type Edges = { [uuid: string]: Edge }

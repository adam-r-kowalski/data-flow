export enum ValueKind {
    NONE,
    NUMBER,
    TENSOR,
}

export interface None {
    kind: ValueKind.NONE
}

export interface Number {
    kind: ValueKind.NUMBER
    value: number
}

export interface Tensor {
    kind: ValueKind.TENSOR
    value: number
}

export type Value = None | Number | Tensor

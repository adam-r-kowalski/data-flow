import * as tf from "@tensorflow/tfjs"

export enum ValueKind {
    NONE,
    NUMBER,
    TENSOR,
    ERROR,
    SCATTER,
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
    value: tf.TensorLike
    rank: number
    shape: number[]
}

export interface Error {
    kind: ValueKind.ERROR
    text: string
}

export interface Scatter {
    kind: ValueKind.SCATTER
    x: number[]
    y: number[]
    domain: [number, number]
    range: [number, number]
}

export type Value = None | Number | Tensor | Error | Scatter

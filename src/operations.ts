import * as tf from "@tensorflow/tfjs"

import { Value, ValueKind, Tensor } from "./value"

export enum OperationKind {
    SOURCE,
    TRANSFORM,
}

interface Source {
    kind: OperationKind.SOURCE
    name: string
    outputs: string[]
    value: number
}

export type Func = (inputs: Value[]) => Value

interface Transform {
    kind: OperationKind.TRANSFORM
    name: string
    inputs: string[]
    outputs: string[]
    func: Func
}

type Operation = Source | Transform

type Operations = { [name: string]: Operation }

const tensorFunc = (func: (...tensors: tf.Tensor[]) => tf.Tensor): Func => {
    return (inputs: Value[]) => ({
        kind: ValueKind.TENSOR,
        value: func
            .apply(
                this,
                inputs.map(
                    (input) => (input as Tensor).value as any as tf.Tensor
                )
            )
            .dataSync()[0] as number,
    })
}

export const operations: Operations = {
    number: {
        kind: OperationKind.SOURCE,
        name: "number",
        outputs: ["out"],
        value: 0,
    },
    add: {
        kind: OperationKind.TRANSFORM,
        name: "add",
        inputs: ["a", "b"],
        outputs: ["out"],
        func: tensorFunc(tf.add),
    },
    sub: {
        kind: OperationKind.TRANSFORM,
        name: "sub",
        inputs: ["a", "b"],
        outputs: ["out"],
        func: tensorFunc(tf.sub),
    },
    mul: {
        kind: OperationKind.TRANSFORM,
        name: "mul",
        inputs: ["a", "b"],
        outputs: ["out"],
        func: tensorFunc(tf.mul),
    },
    div: {
        kind: OperationKind.TRANSFORM,
        name: "div",
        inputs: ["a", "b"],
        outputs: ["out"],
        func: tensorFunc(tf.div),
    },
    maximum: {
        kind: OperationKind.TRANSFORM,
        name: "maximum",
        inputs: ["a", "b"],
        outputs: ["out"],
        func: tensorFunc(tf.maximum),
    },
    minimum: {
        kind: OperationKind.TRANSFORM,
        name: "minimum",
        inputs: ["a", "b"],
        outputs: ["out"],
        func: tensorFunc(tf.minimum),
    },
    mod: {
        kind: OperationKind.TRANSFORM,
        name: "mod",
        inputs: ["a", "b"],
        outputs: ["out"],
        func: tensorFunc(tf.mod),
    },
    pow: {
        kind: OperationKind.TRANSFORM,
        name: "pow",
        inputs: ["a", "b"],
        outputs: ["out"],
        func: tensorFunc(tf.pow),
    },
    "squared difference": {
        kind: OperationKind.TRANSFORM,
        name: "squared difference",
        inputs: ["a", "b"],
        outputs: ["out"],
        func: tensorFunc(tf.squaredDifference),
    },
}

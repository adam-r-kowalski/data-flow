import * as tf from "@tensorflow/tfjs"

import { Value, ValueKind } from "./value"

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

const tensorFunc = (func: (...tensors: tf.TensorLike[]) => tf.Tensor): Func => {
    return (inputs: Value[]) => {
        const tensors: tf.TensorLike[] = []
        for (const input of inputs) {
            switch (input.kind) {
                case ValueKind.NONE:
                    return { kind: ValueKind.NONE }
                case ValueKind.NUMBER:
                case ValueKind.TENSOR:
                    tensors.push(input.value)
                    break
            }
        }
        return {
            kind: ValueKind.TENSOR,
            value: func.apply(this, tensors).dataSync()[0],
        }
    }
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

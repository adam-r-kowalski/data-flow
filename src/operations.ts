import * as tf from "@tensorflow/tfjs"

import { Value, ValueKind } from "./value"
import { Vec2 } from "./vec2"

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

type TensorFunc = (...tensors: tf.TensorLike[]) => tf.Tensor

const tensorFunc = (func: TensorFunc): Func => {
    return (inputs: Value[]) => {
        const tensors: tf.TensorLike[] = []
        for (const input of inputs) {
            switch (input.kind) {
                case ValueKind.NUMBER:
                case ValueKind.TENSOR:
                    tensors.push(input.value)
                    break
                default:
                    return { kind: ValueKind.NONE }
            }
        }
        try {
            const result = func.apply(this, tensors)
            return {
                kind: ValueKind.TENSOR,
                value: result.arraySync(),
                rank: result.rank,
                shape: result.shape,
            }
        } catch (e) {
            if (e instanceof Error) {
                return {
                    kind: ValueKind.ERROR,
                    text: e.message,
                }
            }
            throw e
        }
    }
}

const scatter = (inputs: Value[]): Value => {
    if (inputs.length !== 2) return { kind: ValueKind.NONE }
    const tensors: number[][] = []
    for (const input of inputs) {
        switch (input.kind) {
            case ValueKind.TENSOR:
                if (input.rank === 1) {
                    tensors.push(input.value as number[])
                    break
                }
                return { kind: ValueKind.NONE }
            default:
                return { kind: ValueKind.NONE }
        }
    }
    const [x, y] = tensors
    const domain = [tf.min(x).arraySync(), tf.max(x).arraySync()] as Vec2
    const range = [tf.min(y).arraySync(), tf.max(y).arraySync()] as Vec2
    return { kind: ValueKind.SCATTER, x, y, domain, range }
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
    linspace: {
        kind: OperationKind.TRANSFORM,
        name: "linspace",
        inputs: ["start", "stop", "num"],
        outputs: ["out"],
        func: tensorFunc(tf.linspace as TensorFunc),
    },
    square: {
        kind: OperationKind.TRANSFORM,
        name: "square",
        inputs: ["x"],
        outputs: ["out"],
        func: tensorFunc(tf.square),
    },
    scatter: {
        kind: OperationKind.TRANSFORM,
        name: "scatter",
        inputs: ["x", "y"],
        outputs: ["out"],
        func: scatter as Func,
    },
}

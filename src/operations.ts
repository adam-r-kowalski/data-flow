import * as tf from "@tensorflow/tfjs"

// import { Vec2 } from "./vec2"

export enum OperationKind {
    SOURCE,
    TRANSFORM,
    SINK,
}

export interface SourceOperation {
    kind: OperationKind.SOURCE
    name: string
    outputs: string[]
}

export interface TransformOperation {
    kind: OperationKind.TRANSFORM
    name: string
    inputs: string[]
    outputs: string[]
    func: string
}

export interface SinkOperation {
    kind: OperationKind.SINK
    name: string
    inputs: string[]
    func: string
}

type Operation = SourceOperation | TransformOperation | SinkOperation

type Operations = { [name: string]: Operation }

type TensorFunc = (...tensors: tf.TensorLike[]) => tf.Tensor

// const scatter = (inputs: Value[]): Value => {
//     if (inputs.length !== 2) return { kind: ValueKind.NONE }
//     const tensors: number[][] = []
//     for (const input of inputs) {
//         switch (input.kind) {
//             case ValueKind.TENSOR:
//                 if (input.rank === 1) {
//                     tensors.push(input.value as number[])
//                     break
//                 }
//                 return { kind: ValueKind.NONE }
//             default:
//                 return { kind: ValueKind.NONE }
//         }
//     }
//     const [x, y] = tensors
//     const domain = [tf.min(x).arraySync(), tf.max(x).arraySync()] as Vec2
//     const range = [tf.min(y).arraySync(), tf.max(y).arraySync()] as Vec2
//     return { kind: ValueKind.SCATTER, x, y, domain, range }
// }
//
// const line = (inputs: Value[]): Value => {
//     if (inputs.length !== 2) return { kind: ValueKind.NONE }
//     const tensors: number[][] = []
//     for (const input of inputs) {
//         switch (input.kind) {
//             case ValueKind.TENSOR:
//                 if (input.rank === 1) {
//                     tensors.push(input.value as number[])
//                     break
//                 }
//                 return { kind: ValueKind.NONE }
//             default:
//                 return { kind: ValueKind.NONE }
//         }
//     }
//     const [x, y] = tensors
//     const domain = [tf.min(x).arraySync(), tf.max(x).arraySync()] as Vec2
//     const range = [tf.min(y).arraySync(), tf.max(y).arraySync()] as Vec2
//     return { kind: ValueKind.LINE, x, y, domain, range }
// }
//
export const operations: Operations = {
    num: {
        kind: OperationKind.SOURCE,
        name: "num",
        outputs: [""],
    },
    // add: {
    //     kind: OperationKind.TRANSFORM,
    //     name: "add",
    //     inputs: ["", ""],
    //     outputs: [""],
    //     func: tensorFunc(tf.add),
    // },
    // abs: {
    //     kind: OperationKind.TRANSFORM,
    //     name: "abs",
    //     inputs: [""],
    //     outputs: [""],
    //     func: tensorFunc(tf.abs),
    // },
    // sub: {
    //     kind: OperationKind.TRANSFORM,
    //     name: "sub",
    //     inputs: ["", ""],
    //     outputs: [""],
    //     func: tensorFunc(tf.sub),
    // },
    // mul: {
    //     kind: OperationKind.TRANSFORM,
    //     name: "mul",
    //     inputs: ["", ""],
    //     outputs: [""],
    //     func: tensorFunc(tf.mul),
    // },
    // div: {
    //     kind: OperationKind.TRANSFORM,
    //     name: "div",
    //     inputs: ["", ""],
    //     outputs: [""],
    //     func: tensorFunc(tf.div),
    // },
    // maximum: {
    //     kind: OperationKind.TRANSFORM,
    //     name: "maximum",
    //     inputs: ["", ""],
    //     outputs: [""],
    //     func: tensorFunc(tf.maximum),
    // },
    // mean: {
    //     kind: OperationKind.TRANSFORM,
    //     name: "mean",
    //     inputs: [""],
    //     outputs: [""],
    //     func: tensorFunc(tf.mean as TensorFunc),
    // },
    // minimum: {
    //     kind: OperationKind.TRANSFORM,
    //     name: "minimum",
    //     inputs: ["", ""],
    //     outputs: [""],
    //     func: tensorFunc(tf.minimum),
    // },
    // mod: {
    //     kind: OperationKind.TRANSFORM,
    //     name: "mod",
    //     inputs: ["", ""],
    //     outputs: [""],
    //     func: tensorFunc(tf.mod),
    // },
    // pow: {
    //     kind: OperationKind.TRANSFORM,
    //     name: "pow",
    //     inputs: ["", ""],
    //     outputs: [""],
    //     func: tensorFunc(tf.pow),
    // },
    // "squared difference": {
    //     kind: OperationKind.TRANSFORM,
    //     name: "squared difference",
    //     inputs: ["", ""],
    //     outputs: [""],
    //     func: tensorFunc(tf.squaredDifference),
    // },
    // linspace: {
    //     kind: OperationKind.TRANSFORM,
    //     name: "linspace",
    //     inputs: ["start", "stop", "num"],
    //     outputs: [""],
    //     func: tensorFunc(tf.linspace as TensorFunc),
    // },
    // square: {
    //     kind: OperationKind.TRANSFORM,
    //     name: "square",
    //     inputs: ["x"],
    //     outputs: [""],
    //     func: tensorFunc(tf.square),
    // },
    // scatter: {
    //     kind: OperationKind.TRANSFORM,
    //     name: "scatter",
    //     inputs: ["x", "y"],
    //     outputs: [""],
    //     func: scatter as TransformFunc,
    // },
    // line: {
    //     kind: OperationKind.TRANSFORM,
    //     name: "line",
    //     inputs: ["x", "y"],
    //     outputs: [""],
    //     func: line as TransformFunc,
    // },
    // label: {
    //     kind: OperationKind.SINK,
    //     name: "label",
    //     inputs: [""],
    //     func: (inputs: Value[]): void => {},
    // },
    // read: {
    //     kind: OperationKind.SOURCE,
    //     name: "read",
    //     outputs: [""],
    // },
    // id: {
    //     kind: OperationKind.TRANSFORM,
    //     name: "id",
    //     inputs: [""],
    //     outputs: [""],
    //     func: (inputs: Value[]) => inputs[0],
    // },
}

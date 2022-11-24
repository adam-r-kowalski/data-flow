import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-backend-cpu"
import "@tensorflow/tfjs-backend-wasm"
import "@tensorflow/tfjs-backend-webgl"
import { Vec2 } from "../vec2"
tf.setBackend("cpu")

import { Value } from "./value"

type TensorFunc = (...tensors: tf.TensorLike[]) => tf.Tensor
const tensorFunc = (f: TensorFunc): Value => ({
    type: "Function",
    fn: (args: Value[]): Value => {
        const tensors = args.map((x) => x.data)
        const result = f.apply(null, tensors)
        const data = result.arraySync()
        return {
            type: "Tensor",
            data,
            size: result.size,
            shape: result.shape,
            rank: result.rank,
            dtype: result.dtype,
        }
    },
})

const label: Value = {
    type: "Function",
    fn: (args: Value[]): Value => ({ type: "None" }),
}

const bounds = (value: tf.TensorLike): Vec2 => {
    const min = tf.min(value).arraySync() as number
    const max = tf.max(value).arraySync() as number
    const lower = min - Math.abs(min * 0.05) - Number.MIN_VALUE
    const upper = max + Math.abs(max * 0.05) + Number.MIN_VALUE
    return [lower, upper]
}

const scatter: Value = {
    type: "Function",
    fn: (args: Value[]): Value => {
        let data: tf.TensorLike[] = []
        for (const arg of args) {
            if (arg.type !== "Tensor" || arg.size < 2) return { type: "None" }
            data.push(arg.data)
        }
        const [x, y] = data
        const domain = bounds(x)
        const range = bounds(y)
        return { type: "Scatter", x, y, domain, range }
    },
}

const line: Value = {
    type: "Function",
    fn: (args: Value[]): Value => {
        let data: tf.TensorLike[] = []
        for (const arg of args) {
            if (arg.type !== "Tensor" || arg.size < 2) return { type: "None" }
            data.push(arg.data)
        }
        const [x, y] = data
        const domain = bounds(x)
        const range = bounds(y)
        return { type: "Line", x, y, domain, range }
    },
}

const id: Value = {
    type: "Function",
    fn: (args: Value[]): Value => args[0],
}

export const base: Value = {
    type: "Module",
    add: tensorFunc(tf.add),
    sub: tensorFunc(tf.sub),
    mul: tensorFunc(tf.mul),
    div: tensorFunc(tf.div),
    abs: tensorFunc(tf.abs),
    mean: tensorFunc(tf.mean as TensorFunc),
    maximum: tensorFunc(tf.maximum),
    minimum: tensorFunc(tf.minimum),
    mod: tensorFunc(tf.mod),
    pow: tensorFunc(tf.pow),
    linspace: tensorFunc(tf.linspace as TensorFunc),
    "squared difference": tensorFunc(tf.squaredDifference),
    square: tensorFunc(tf.square),
    id,
    label,
    scatter,
    line,
}

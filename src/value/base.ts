import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-backend-cpu"
import "@tensorflow/tfjs-backend-wasm"
import "@tensorflow/tfjs-backend-webgl"
import { Vec2 } from "../vec2"
tf.setBackend("cpu")

import { Value } from "./value"
import { show } from "./show"

type TensorFunc = (...tensors: tf.TensorLike[]) => tf.Tensor
const tensorFunc = (f: TensorFunc): Value => ({
    type: "Function",
    fn: (args: Value[]): Value => {
        const tensors: tf.TensorLike[] = []
        for (const arg of args) {
            if (arg.type === "None") return { type: "None" }
            tensors.push(arg.data)
        }
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

const overlay: Value = {
    type: "Function",
    fn: (plots: Value[]): Value => {
        const { domain, range } = plots.reduce(
            (acc, plot) => {
                const domain = [
                    Math.min(acc.domain[0], plot.domain[0]),
                    Math.max(acc.domain[1], plot.domain[1]),
                ]
                const range = [
                    Math.min(acc.range[0], plot.range[0]),
                    Math.max(acc.range[1], plot.range[1]),
                ]
                return { domain, range }
            },
            {
                domain: [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
                range: [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
            }
        )
        return { type: "Overlay", plots, domain, range }
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
    overlay,
    line,
    show,
}

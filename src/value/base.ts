import * as tf from "@tensorflow/tfjs"
import { Vec2 } from "../vec2"
tf.setBackend("cpu")

import { Value } from "./value"
import { show } from "./show"

type TensorFunc = (...tensors: tf.TensorLike[]) => tf.Tensor
const tensorFunc = (f: TensorFunc, inputs: string[]): Value => ({
    type: "fn",
    fn: (args: Value[]): Value => {
        const tensors: tf.TensorLike[] = []
        for (const arg of args) {
            if (arg.type === "none") return { type: "none" }
            tensors.push(arg.data)
        }
        const result = f.apply(null, tensors)
        const data = result.arraySync()
        return {
            type: "tensor",
            data,
            size: result.size,
            shape: result.shape,
            rank: result.rank,
            dtype: result.dtype,
        }
    },
    inputs,
})

const bounds = (value: tf.TensorLike): Vec2 => {
    const min = tf.min(value).arraySync() as number
    const max = tf.max(value).arraySync() as number
    const lower = min - Math.abs(min * 0.05) - Number.MIN_VALUE
    const upper = max + Math.abs(max * 0.05) + Number.MIN_VALUE
    return [lower, upper]
}

const scatter: Value = {
    type: "fn",
    fn: (args: Value[]): Value => {
        let data: tf.TensorLike[] = []
        for (const arg of args) {
            if (arg.type !== "tensor" || arg.size < 2) return { type: "none" }
            data.push(arg.data)
        }
        const [x, y] = data
        const domain = bounds(x)
        const range = bounds(y)
        return { type: "scatter", x, y, domain, range }
    },
    inputs: ["x", "y"],
}

const line: Value = {
    type: "fn",
    fn: (args: Value[]): Value => {
        let data: tf.TensorLike[] = []
        for (const arg of args) {
            if (arg.type !== "tensor" || arg.size < 2) return { type: "none" }
            data.push(arg.data)
        }
        const [x, y] = data
        const domain = bounds(x)
        const range = bounds(y)
        return { type: "line", x, y, domain, range }
    },
    inputs: ["x", "y"],
}

const overlay: Value = {
    type: "fn",
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
        return { type: "overlay", plots, domain, range }
    },
    inputs: ["", ""],
}

const id: Value = {
    type: "fn",
    fn: (args: Value[]): Value => args[0],
    inputs: [""],
}

export const base: Value = {
    type: "module",
    add: tensorFunc(tf.add, ["", ""]),
    sub: tensorFunc(tf.sub, ["", ""]),
    mul: tensorFunc(tf.mul, ["", ""]),
    div: tensorFunc(tf.div, ["", ""]),
    abs: tensorFunc(tf.abs, [""]),
    mean: tensorFunc(tf.mean as TensorFunc, [""]),
    maximum: tensorFunc(tf.maximum, [""]),
    minimum: tensorFunc(tf.minimum, [""]),
    mod: tensorFunc(tf.mod, ["", ""]),
    pow: tensorFunc(tf.pow, ["", ""]),
    linspace: tensorFunc(tf.linspace as TensorFunc, ["start", "stop", "num"]),
    "squared difference": tensorFunc(tf.squaredDifference, ["", ""]),
    square: tensorFunc(tf.square, [""]),
    id,
    scatter,
    overlay,
    line,
    show,
    label: { type: "label", name: "" },
    read: { type: "read", name: "" },
    num: { type: "num", data: 0 },
}

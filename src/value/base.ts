import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-backend-cpu"
import "@tensorflow/tfjs-backend-wasm"
import "@tensorflow/tfjs-backend-webgl"
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

export const base: Value = {
    type: "Module",
    add: tensorFunc(tf.add),
}

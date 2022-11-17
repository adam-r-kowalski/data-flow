import * as tf from "@tensorflow/tfjs-node"
import { test, expect } from "vitest"

import "./almost_equal"

interface Linear {
    m: tf.Variable
    b: tf.Variable
}

const predict = ({ m, b }: Linear, x: tf.Tensor): tf.Tensor => x.mul(m).add(b)

const loss = (y: tf.Tensor, y_hat: tf.Tensor): tf.Scalar =>
    y.sub(y_hat).abs().mean()

type Grads = tf.NamedTensorMap

const update = ({ m, b }: Linear, grads: Grads, eta: number): Linear => ({
    m: tf.variable(m.sub(grads[m.name].mul(eta))),
    b: tf.variable(b.sub(grads[b.name].mul(eta))),
})

interface Data {
    x: tf.Tensor
    y: tf.Tensor
}

const step = (model: Linear, { x, y }: Data, eta: number): Linear => {
    const result = tf.variableGrads(() => {
        const y_hat = predict(model, x)
        return loss(y, y_hat)
    })
    return update(model, result.grads, eta)
}

const repeat = (n: number, f: () => void) => {
    for (let i = 0; i < n; ++i) f()
}

test("linear regression", () => {
    const x = tf.linspace(-10, 10, 100)
    const y = tf.add(tf.mul(x, 3), 5)
    const data = { x, y }
    const eta = 0.03
    let model = {
        m: tf.variable(tf.randomNormal([])),
        b: tf.variable(tf.randomNormal([])),
    }
    repeat(300, () => (model = step(model, data, eta)))
    expect(model.m.arraySync()).toBeCloseTo(3, 0.1)
    expect(model.b.arraySync()).toBeCloseTo(5, 0.1)
})

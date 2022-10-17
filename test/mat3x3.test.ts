import { test, expect } from "vitest"
import * as fc from "fast-check"

import { one, zero, mul, add, translate, scale, Mat3x3 } from "../src/mat3x3"

const N = fc.integer({ min: -10000, max: 10000 })

const Mat = fc.tuple(N, N, N, N, N, N, N, N, N)

expect.extend({
    equalMat(received: Mat3x3, expected: Mat3x3) {
        for (let i = 0; i < 9; ++i) {
            if (received[i] !== expected[i]) {
                return {
                    pass: false,
                    message: () =>
                        `received[${i}] !== expected[${i}] (${received[i]}, ${expected[i]})`,
                }
            }
        }
        return { pass: true, message: () => "" }
    },
})

interface CustomMatchers<R = unknown> {
    equalMat(mat: Mat3x3): R
}

declare global {
    namespace Vi {
        interface JestAssertion extends CustomMatchers {}
    }
}

test("AI = A", () => {
    fc.assert(
        fc.property(Mat, (a) => {
            expect(mul(a, one)).equalMat(a)
        })
    )
})

test("IA = A", () => {
    fc.assert(
        fc.property(Mat, (a) => {
            expect(mul(one, a)).equalMat(a)
        })
    )
})

test("(AB)C = A(BC)", () => {
    fc.assert(
        fc.property(Mat, Mat, Mat, (a, b, c) => {
            expect(mul(mul(a, b), c)).equalMat(mul(a, mul(b, c)))
        })
    )
})

test("A(B + C) == AB + AC", () => {
    fc.assert(
        fc.property(Mat, Mat, Mat, (a, b, c) => {
            expect(mul(a, add(b, c))).equalMat(add(mul(a, b), mul(a, c)))
        })
    )
})

test("(B + C)A == BA + CA", () => {
    fc.assert(
        fc.property(Mat, Mat, Mat, (a, b, c) => {
            expect(mul(add(b, c), a)).equalMat(add(mul(b, a), mul(c, a)))
        })
    )
})

test("OA == O", () => {
    fc.assert(
        fc.property(Mat, (a) => {
            expect(mul(zero, a)).equalMat(zero)
        })
    )
})

test("translate and scale", () => {
    fc.assert(
        fc.property(N, N, N, (x, y, s) => {
            const actual = mul(translate(x, y), scale(s))
            const expected: Mat3x3 = [s, 0, x, 0, s, y, 0, 0, 1]
            expect(actual).equalMat(expected)
        })
    )
})

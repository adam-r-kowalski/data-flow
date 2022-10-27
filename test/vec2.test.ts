import "./almost_equal"

import { test, expect } from "vitest"
import * as fc from "fast-check"

import { add, scale, zero } from "../src/vec2"
import "./almost_equal"

const N = fc.integer({ min: -10000, max: 10000 })

const Vec = fc.tuple(N, N)

test("A + B = B + A", () => {
    fc.assert(
        fc.property(Vec, Vec, (A, B) => {
            expect(add(A, B)).toAlmostEqual(add(B, A))
        })
    )
})

test("(A + B) + C = A + (B + C)", () => {
    fc.assert(
        fc.property(Vec, Vec, Vec, (A, B, C) => {
            expect(add(add(A, B), C)).toAlmostEqual(add(A, add(B, C)))
        })
    )
})

test("A + 0 = A = 0 + A", () => {
    fc.assert(
        fc.property(Vec, (A) => {
            expect(add(A, zero)).toAlmostEqual(A)
            expect(add(zero, A)).toAlmostEqual(A)
        })
    )
})

test("A + -A = 0", () => {
    fc.assert(
        fc.property(Vec, (A) => {
            expect(add(A, scale(A, -1))).toAlmostEqual(zero)
        })
    )
})

test("s(A + B) = sA + sB", () => {
    fc.assert(
        fc.property(Vec, Vec, N, (A, B, s) => {
            expect(scale(add(A, B), s)).toAlmostEqual(
                add(scale(A, s), scale(B, s))
            )
        })
    )
})

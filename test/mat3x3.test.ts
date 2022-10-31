import { test, expect } from "vitest"
import * as fc from "fast-check"

import {
    one,
    zero,
    matMul,
    add,
    translate,
    scale,
    inverse,
    Mat3x3,
    determinant,
    vecMul,
} from "../src/graph/mat3x3"
import { length } from "../src/graph/vec3"
import "./almost_equal"

const N = fc.integer({ min: -10000, max: 10000 })

const Mat = fc.tuple(N, N, N, N, N, N, N, N, N)

test("AI = A", () => {
    fc.assert(
        fc.property(Mat, (a) => {
            expect(matMul(a, one)).toAlmostEqual(a)
        })
    )
})

test("IA = A", () => {
    fc.assert(
        fc.property(Mat, (a) => {
            expect(matMul(one, a)).toAlmostEqual(a)
        })
    )
})

test("(AB)C = A(BC)", () => {
    fc.assert(
        fc.property(Mat, Mat, Mat, (a, b, c) => {
            expect(matMul(matMul(a, b), c)).toAlmostEqual(
                matMul(a, matMul(b, c))
            )
        })
    )
})

test("A(B + C) == AB + AC", () => {
    fc.assert(
        fc.property(Mat, Mat, Mat, (a, b, c) => {
            expect(matMul(a, add(b, c))).toAlmostEqual(
                add(matMul(a, b), matMul(a, c))
            )
        })
    )
})

test("(B + C)A == BA + CA", () => {
    fc.assert(
        fc.property(Mat, Mat, Mat, (a, b, c) => {
            expect(matMul(add(b, c), a)).toAlmostEqual(
                add(matMul(b, a), matMul(c, a))
            )
        })
    )
})

test("OA == O", () => {
    fc.assert(
        fc.property(Mat, (a) => {
            expect(matMul(zero, a)).toAlmostEqual(zero)
        })
    )
})

test("translate and scale", () => {
    fc.assert(
        fc.property(N, N, N, (x, y, s) => {
            const actual = matMul(translate(x, y), scale(s))
            const expected: Mat3x3 = [s, 0, x, 0, s, y, 0, 0, 1]
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("AA^-1 == I", () => {
    fc.assert(
        fc.property(
            Mat.filter((a) => determinant(a) !== 0),
            (a) => {
                expect(matMul(a, inverse(a))).toAlmostEqual(one)
            }
        )
    )
})

test("A^-1A == I", () => {
    fc.assert(
        fc.property(
            Mat.filter((a) => determinant(a) !== 0),
            (a) => {
                expect(matMul(inverse(a), a)).toAlmostEqual(one)
            }
        )
    )
})

test("find scale", () => {
    fc.assert(
        fc.property(N, N, fc.nat(), fc.nat(), (x, y, s, s2) => {
            const mat = matMul(matMul(scale(s), translate(x, y)), scale(s2))
            const expected = length(vecMul(mat, [0, 1, 0]))
            const actual = s * s2
            expect(actual).toEqual(expected)
            expect(mat[0]).toEqual(mat[4])
            expect(actual).toEqual(mat[0])
        })
    )
})

test("find translation", () => {
    fc.assert(
        fc.property(N, N, N, N, fc.nat(), (x, y, x1, y1, s) => {
            const mat = matMul(
                matMul(translate(x, y), scale(s)),
                translate(x1, y1)
            )
            const expected = [mat[2], mat[5]]
            const actual = [x + s * x1, y + s * y1]
            expect(actual).toEqual(expected)
        })
    )
})

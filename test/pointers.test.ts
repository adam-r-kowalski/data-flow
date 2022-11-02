import { test, expect } from "vitest"
import * as fc from "fast-check"

import "./almost_equal"
import {
    onPointerDown,
    onPointerUp,
    Pointer,
    Pointers,
    PointersKind,
    Target,
    TargetKind,
} from "../src/graph/pointers"
import { Arbitrary } from "fast-check"
import { distance, midpoint } from "../src/graph/vec2"

const N = fc.integer({ min: -10000, max: 10000 })

const PointerArb: Arbitrary<Pointer> = fc.record({
    id: N,
    position: fc.tuple(N, N),
})

const PointersArb = (n: number): Arbitrary<Pointer[]> =>
    fc
        .array(PointerArb, { minLength: n, maxLength: n })
        .filter((pointers) => new Set(pointers.map((p) => p.id)).size === n)

test("pointer down on background with no pointers down", () => {
    fc.assert(
        fc.property(PointerArb, (pointer) => {
            const target: Target = { kind: TargetKind.BACKGROUND }
            let pointers: Pointers = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, pointer, target)
            expect(pointers).toAlmostEqual({
                kind: PointersKind.ONE,
                pointer,
                target,
            })
        })
    )
})

test("pointer down on node with no pointers down", () => {
    fc.assert(
        fc.property(PointerArb, (pointer) => {
            const target: Target = {
                kind: TargetKind.NODE,
                id: 1,
                portIds: new Set(["1", "2", "3"]),
            }
            let pointers: Pointers = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, pointer, target)
            const expected: Pointers = {
                kind: PointersKind.ONE,
                pointer,
                target,
            }
            expect(pointers).toAlmostEqual(expected)
        })
    )
})

test("pointer down with one pointer down", () => {
    fc.assert(
        fc.property(PointersArb(2), ([p1, p2]) => {
            const target: Target = { kind: TargetKind.BACKGROUND }
            let pointers: Pointers = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            pointers = onPointerDown(pointers, p2, target)
            const expected: Pointers = {
                kind: PointersKind.TWO,
                data: {
                    [p1.id]: p1,
                    [p2.id]: p2,
                },
                midpoint: midpoint(p1.position, p2.position),
                distance: distance(p1.position, p2.position),
            }
            expect(pointers).toAlmostEqual(expected)
        })
    )
})

test("pointer down with two pointers down", () => {
    fc.assert(
        fc.property(PointersArb(3), ([p1, p2, p3]) => {
            const target: Target = { kind: TargetKind.BACKGROUND }
            let pointers: Pointers = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            pointers = onPointerDown(pointers, p2, target)
            pointers = onPointerDown(pointers, p3, target)
            const expected: Pointers = {
                kind: PointersKind.THREE_OR_MORE,
                data: {
                    [p1.id]: p1,
                    [p2.id]: p2,
                    [p3.id]: p3,
                },
            }
            expect(pointers).toAlmostEqual(expected)
        })
    )
})

test("pointer down with three or more pointers down", () => {
    fc.assert(
        fc.property(PointersArb(4), ([p1, p2, p3, p4]) => {
            const target: Target = { kind: TargetKind.BACKGROUND }
            let pointers: Pointers = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            pointers = onPointerDown(pointers, p2, target)
            pointers = onPointerDown(pointers, p3, target)
            pointers = onPointerDown(pointers, p4, target)
            const expected: Pointers = {
                kind: PointersKind.THREE_OR_MORE,
                data: {
                    [p1.id]: p1,
                    [p2.id]: p2,
                    [p3.id]: p3,
                    [p4.id]: p4,
                },
            }
            expect(pointers).toAlmostEqual(expected)
        })
    )
})

test("pointer up with four pointers down", () => {
    fc.assert(
        fc.property(PointersArb(4), ([p1, p2, p3, p4]) => {
            const target: Target = { kind: TargetKind.BACKGROUND }
            let pointers: Pointers = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            pointers = onPointerDown(pointers, p2, target)
            pointers = onPointerDown(pointers, p3, target)
            pointers = onPointerDown(pointers, p4, target)
            pointers = onPointerUp(pointers, p4)
            const expected: Pointers = {
                kind: PointersKind.THREE_OR_MORE,
                data: {
                    [p1.id]: p1,
                    [p2.id]: p2,
                    [p3.id]: p3,
                },
            }
            expect(pointers).toAlmostEqual(expected)
        })
    )
})

test("pointer up with three pointers down", () => {
    fc.assert(
        fc.property(PointersArb(3), ([p1, p2, p3]) => {
            const target: Target = { kind: TargetKind.BACKGROUND }
            let pointers: Pointers = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            pointers = onPointerDown(pointers, p2, target)
            pointers = onPointerDown(pointers, p3, target)
            pointers = onPointerUp(pointers, p3)
            const expected: Pointers = {
                kind: PointersKind.TWO,
                data: {
                    [p1.id]: p1,
                    [p2.id]: p2,
                },
                midpoint: midpoint(p1.position, p2.position),
                distance: distance(p1.position, p2.position),
            }
            expect(pointers).toAlmostEqual(expected)
        })
    )
})

test("pointer up with two pointers down", () => {
    fc.assert(
        fc.property(PointersArb(2), ([p1, p2]) => {
            const target: Target = { kind: TargetKind.BACKGROUND }
            let pointers: Pointers = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            pointers = onPointerDown(pointers, p2, target)
            pointers = onPointerUp(pointers, p2)
            const expected: Pointers = {
                kind: PointersKind.ONE,
                pointer: p1,
                target,
            }
            expect(pointers).toAlmostEqual(expected)
        })
    )
})

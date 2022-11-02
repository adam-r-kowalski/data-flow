import { test, expect } from "vitest"
import * as fc from "fast-check"

import "./almost_equal"
import {
    Move,
    MoveKind,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    Pointer,
    Pointers,
    PointersKind,
    Target,
    TargetKind,
} from "../src/graph/pointers"
import { Arbitrary } from "fast-check"
import { distance, midpoint, sub, Vec2 } from "../src/graph/vec2"

const N = fc.integer({ min: -10000, max: 10000 })

const Vec2Arb: Arbitrary<Vec2> = fc.tuple(N, N)

const PointerArb: Arbitrary<Pointer> = fc.record({
    id: N,
    position: Vec2Arb,
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

test("pointer up with one pointer down", () => {
    fc.assert(
        fc.property(PointerArb, (pointer) => {
            const target: Target = { kind: TargetKind.BACKGROUND }
            let pointers: Pointers = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, pointer, target)
            pointers = onPointerUp(pointers, pointer)
            const expected: Pointers = { kind: PointersKind.ZERO }
            expect(pointers).toAlmostEqual(expected)
        })
    )
})

test("pointer move with no pointers down", () => {
    fc.assert(
        fc.property(PointerArb, (pointer) => {
            let pointers: Pointers = { kind: PointersKind.ZERO }
            const actual = onPointerMove(pointers, pointer)
            const expected: [Pointers, Move] = [
                { kind: PointersKind.ZERO },
                { kind: MoveKind.NONE },
            ]
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("pointer move with one pointer down where target is background", () => {
    fc.assert(
        fc.property(PointerArb, Vec2Arb, (p1, position) => {
            const target: Target = { kind: TargetKind.BACKGROUND }
            let pointers: Pointers = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            const p2 = { ...p1, position }
            const actual = onPointerMove(pointers, p2)
            const expected: [Pointers, Move] = [
                { kind: PointersKind.ONE, pointer: p2, target },
                {
                    kind: MoveKind.BACKGROUND,
                    delta: sub(p1.position, p2.position),
                },
            ]
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("pointer move with one pointer down where target is node", () => {
    fc.assert(
        fc.property(PointerArb, Vec2Arb, (p1, position) => {
            const target: Target = {
                kind: TargetKind.NODE,
                id: 0,
                portIds: new Set(["1", "2", "3"]),
            }
            let pointers: Pointers = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            const p2 = { ...p1, position }
            const actual = onPointerMove(pointers, p2)
            const expected: [Pointers, Move] = [
                { kind: PointersKind.ONE, pointer: p2, target },
                {
                    kind: MoveKind.NODE,
                    delta: sub(p1.position, p2.position),
                    id: target.id,
                    portIds: target.portIds,
                },
            ]
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("pointer move with two pointers down", () => {
    fc.assert(
        fc.property(PointersArb(2), Vec2Arb, ([p1, p2], position) => {
            const target: Target = { kind: TargetKind.BACKGROUND }
            let pointers: Pointers = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            pointers = onPointerDown(pointers, p2, target)
            const p3 = { ...p1, position }
            const actual = onPointerMove(pointers, p3)
            const oldMidpoint = midpoint(p1.position, p2.position)
            const oldDistance = distance(p1.position, p2.position)
            const newMidpoint = midpoint(p3.position, p2.position)
            const newDistance = distance(p3.position, p2.position)
            const expected: [Pointers, Move] = [
                {
                    kind: PointersKind.TWO,
                    data: { [p1.id]: p3, [p2.id]: p2 },
                    midpoint: newMidpoint,
                    distance: newDistance,
                },
                {
                    kind: MoveKind.PINCH,
                    pan: sub(oldMidpoint, newMidpoint),
                    zoom: oldDistance - newDistance,
                    into: newMidpoint,
                },
            ]
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("pointer move with three pointers down", () => {
    fc.assert(
        fc.property(PointersArb(3), Vec2Arb, ([p1, p2, p3], position) => {
            const target: Target = { kind: TargetKind.BACKGROUND }
            let pointers: Pointers = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            pointers = onPointerDown(pointers, p2, target)
            pointers = onPointerDown(pointers, p3, target)
            const p4 = { ...p1, position }
            const actual = onPointerMove(pointers, p4)
            const expected: [Pointers, Move] = [
                {
                    kind: PointersKind.THREE_OR_MORE,
                    data: { [p1.id]: p4, [p2.id]: p2, [p3.id]: p3 },
                },
                { kind: MoveKind.NONE },
            ]
            expect(actual).toAlmostEqual(expected)
        })
    )
})

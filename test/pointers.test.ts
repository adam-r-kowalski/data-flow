import { test, expect } from "vitest"
import * as fc from "fast-check"
import { Arbitrary } from "fast-check"
import { midpoint, distance, Vec2, sub } from "../src/vec2"
import {
    Pointer,
    pointerDown,
    pointerMove,
    PointerMoveKind,
    Pointers,
    PointersKind,
    pointerUp,
} from "../src/pointers"

const PointerArb: Arbitrary<Pointer> = fc
    .tuple(fc.integer(), fc.integer(), fc.integer())
    .map(([id, x, y]) => ({ id, pos: [x, y] }))

const PointersArb = (n: number): Arbitrary<Pointer[]> =>
    fc
        .array(PointerArb, { minLength: n, maxLength: n })
        .filter((pointers) => new Set(pointers.map(({ id }) => id)).size === n)

const Vec2Arb: Arbitrary<Vec2> = fc.tuple(fc.integer(), fc.integer())

test("pointer down with no pointers", () => {
    fc.assert(
        fc.property(PointerArb, (pointer) => {
            let pointers: Pointers = { kind: PointersKind.NO_POINTER }
            pointers = pointerDown(pointers, pointer)
            expect(pointers).toEqual({
                kind: PointersKind.ONE_POINTER,
                pointer,
            })
        })
    )
})

test("pointer down with one pointer", () => {
    fc.assert(
        fc.property(PointersArb(2), ([p1, p2]) => {
            let pointers: Pointers = { kind: PointersKind.NO_POINTER }
            pointers = pointerDown(pointers, p1)
            pointers = pointerDown(pointers, p2)
            expect(pointers).toEqual({
                kind: PointersKind.TWO_POINTERS,
                pointers: { [p1.id]: p1, [p2.id]: p2 },
                midpoint: midpoint(p1.pos, p2.pos),
                distance: distance(p1.pos, p2.pos),
            })
        })
    )
})

test("pointer down with two pointers", () => {
    fc.assert(
        fc.property(PointersArb(3), ([p1, p2, p3]) => {
            let pointers: Pointers = { kind: PointersKind.NO_POINTER }
            pointers = pointerDown(pointers, p1)
            pointers = pointerDown(pointers, p2)
            pointers = pointerDown(pointers, p3)
            expect(pointers).toEqual({
                kind: PointersKind.THREE_OR_MORE_POINTERS,
                pointers: { [p1.id]: p1, [p2.id]: p2, [p3.id]: p3 },
            })
        })
    )
})

test("pointer down with three pointers", () => {
    fc.assert(
        fc.property(PointersArb(4), ([p1, p2, p3, p4]) => {
            let pointers: Pointers = { kind: PointersKind.NO_POINTER }
            pointers = pointerDown(pointers, p1)
            pointers = pointerDown(pointers, p2)
            pointers = pointerDown(pointers, p3)
            pointers = pointerDown(pointers, p4)
            expect(pointers).toEqual({
                kind: PointersKind.THREE_OR_MORE_POINTERS,
                pointers: {
                    [p1.id]: p1,
                    [p2.id]: p2,
                    [p3.id]: p3,
                    [p4.id]: p4,
                },
            })
        })
    )
})

test("pointer up with four pointers", () => {
    fc.assert(
        fc.property(PointersArb(4), ([p1, p2, p3, p4]) => {
            let pointers: Pointers = { kind: PointersKind.NO_POINTER }
            pointers = pointerDown(pointers, p1)
            pointers = pointerDown(pointers, p2)
            pointers = pointerDown(pointers, p3)
            pointers = pointerDown(pointers, p4)
            pointers = pointerUp(pointers, p1.id)
            expect(pointers).toEqual({
                kind: PointersKind.THREE_OR_MORE_POINTERS,
                pointers: {
                    [p2.id]: p2,
                    [p3.id]: p3,
                    [p4.id]: p4,
                },
            })
        })
    )
})

test("pointer up with three pointers", () => {
    fc.assert(
        fc.property(PointersArb(3), ([p1, p2, p3]) => {
            let pointers: Pointers = { kind: PointersKind.NO_POINTER }
            pointers = pointerDown(pointers, p1)
            pointers = pointerDown(pointers, p2)
            pointers = pointerDown(pointers, p3)
            pointers = pointerUp(pointers, p1.id)
            expect(pointers).toEqual({
                kind: PointersKind.TWO_POINTERS,
                pointers: {
                    [p2.id]: p2,
                    [p3.id]: p3,
                },
                midpoint: midpoint(p2.pos, p3.pos),
                distance: distance(p2.pos, p3.pos),
            })
        })
    )
})

test("pointer up with two pointers", () => {
    fc.assert(
        fc.property(PointersArb(2), ([p1, p2]) => {
            let pointers: Pointers = { kind: PointersKind.NO_POINTER }
            pointers = pointerDown(pointers, p1)
            pointers = pointerDown(pointers, p2)
            pointers = pointerUp(pointers, p1.id)
            expect(pointers).toEqual({
                kind: PointersKind.ONE_POINTER,
                pointer: p2,
            })
        })
    )
})

test("pointer up with one pointer", () => {
    fc.assert(
        fc.property(PointerArb, (p1) => {
            let pointers: Pointers = { kind: PointersKind.NO_POINTER }
            pointers = pointerDown(pointers, p1)
            pointers = pointerUp(pointers, p1.id)
            expect(pointers).toEqual({ kind: PointersKind.NO_POINTER })
        })
    )
})

test("pointer up with no pointers throws", () => {
    fc.assert(
        fc.property(PointerArb, (p) => {
            const pointers: Pointers = { kind: PointersKind.NO_POINTER }
            expect(() => pointerUp(pointers, p.id)).toThrow(
                "pointer up when no pointers are down"
            )
        })
    )
})

test("pointer move when no pointers down", () => {
    fc.assert(
        fc.property(PointerArb, (p) => {
            const pointers: Pointers = { kind: PointersKind.NO_POINTER }
            expect(pointerMove(pointers, p)).toEqual({
                kind: PointerMoveKind.IGNORE,
                pointers,
            })
        })
    )
})

test("pointer move when one pointer down", () => {
    fc.assert(
        fc.property(PointerArb, Vec2Arb, (p, pos) => {
            let pointers: Pointers = { kind: PointersKind.NO_POINTER }
            pointers = pointerDown(pointers, p)
            const result = pointerMove(pointers, { id: p.id, pos })
            expect(result).toEqual({
                kind: PointerMoveKind.DRAG,
                pointers: {
                    kind: PointersKind.ONE_POINTER,
                    pointer: { id: p.id, pos },
                },
                delta: sub(pos, p.pos),
            })
        })
    )
})

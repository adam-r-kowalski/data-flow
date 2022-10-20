import { test, expect } from "vitest"
import * as fc from "fast-check"
import { Arbitrary } from "fast-check"
import { midpoint, distance, Vec2 } from "../src/vec2"

interface Pointer {
    id: number
    pos: Vec2
}

enum Kind {
    NO_POINTER,
    ONE_POINTER,
    TWO_POINTERS,
    THREE_OR_MORE_POINTERS,
}

interface NoPointer {
    kind: Kind.NO_POINTER
}

interface OnePointer {
    kind: Kind.ONE_POINTER
    pointer: Pointer
}

interface TwoPointers {
    kind: Kind.TWO_POINTERS
    pointers: { [id: number]: Pointer }
    midpoint: Vec2
    distance: number
}

interface ThreeOrMorePointers {
    kind: Kind.THREE_OR_MORE_POINTERS
    pointers: { [id: number]: Pointer }
}

type Pointers = NoPointer | OnePointer | TwoPointers | ThreeOrMorePointers

const pointerDown = (pointers: Pointers, pointer: Pointer): Pointers => {
    switch (pointers.kind) {
        case Kind.NO_POINTER:
            return {
                kind: Kind.ONE_POINTER,
                pointer,
            }
        case Kind.ONE_POINTER:
            const [p1, p2] = [pointers.pointer, pointer]
            return {
                kind: Kind.TWO_POINTERS,
                pointers: {
                    [p1.id]: p1,
                    [p2.id]: p2,
                },
                midpoint: midpoint(p1.pos, p2.pos),
                distance: distance(p1.pos, p2.pos),
            }
        case Kind.TWO_POINTERS:
        case Kind.THREE_OR_MORE_POINTERS:
            return {
                kind: Kind.THREE_OR_MORE_POINTERS,
                pointers: {
                    ...pointers.pointers,
                    [pointer.id]: pointer,
                },
            }
    }
}

const pointerUp = (pointers: Pointers, pointer: Pointer): Pointers => {
    switch (pointers.kind) {
        case Kind.THREE_OR_MORE_POINTERS: {
            const { [pointer.id]: _, ...rest } = pointers.pointers
            const values = Object.values(rest)
            if (values.length >= 3) {
                return {
                    kind: Kind.THREE_OR_MORE_POINTERS,
                    pointers: rest,
                }
            } else {
                const [p1, p2] = values
                return {
                    kind: Kind.TWO_POINTERS,
                    pointers: rest,
                    midpoint: midpoint(p1.pos, p2.pos),
                    distance: distance(p1.pos, p2.pos),
                }
            }
        }
        case Kind.TWO_POINTERS: {
            const { [pointer.id]: _, ...rest } = pointers.pointers
            const [p] = Object.values(rest)
            return {
                kind: Kind.ONE_POINTER,
                pointer: p,
            }
        }
        case Kind.ONE_POINTER:
            return { kind: Kind.NO_POINTER }
        case Kind.NO_POINTER:
            throw "can't perform pointer up when no pointers are down"
    }
}

const PointerArb: Arbitrary<Pointer> = fc
    .tuple(fc.integer(), fc.integer(), fc.integer())
    .map(([id, x, y]) => ({ id, pos: [x, y] }))

const PointersArb = (n: number): Arbitrary<Pointer[]> =>
    fc
        .array(PointerArb, { minLength: n, maxLength: n })
        .filter((pointers) => new Set(pointers.map(({ id }) => id)).size === n)

test("transition from no pointers to one pointer", () => {
    fc.assert(
        fc.property(PointerArb, (pointer) => {
            let pointers: Pointers = { kind: Kind.NO_POINTER }
            pointers = pointerDown(pointers, pointer)
            expect(pointers).toEqual({ kind: Kind.ONE_POINTER, pointer })
        })
    )
})

test("transition from one pointer to two pointers", () => {
    fc.assert(
        fc.property(PointersArb(2), ([p1, p2]) => {
            let pointers: Pointers = { kind: Kind.NO_POINTER }
            pointers = pointerDown(pointers, p1)
            pointers = pointerDown(pointers, p2)
            expect(pointers).toEqual({
                kind: Kind.TWO_POINTERS,
                pointers: { [p1.id]: p1, [p2.id]: p2 },
                midpoint: midpoint(p1.pos, p2.pos),
                distance: distance(p1.pos, p2.pos),
            })
        })
    )
})

test("transition from two pointers to three pointers", () => {
    fc.assert(
        fc.property(PointersArb(3), ([p1, p2, p3]) => {
            let pointers: Pointers = { kind: Kind.NO_POINTER }
            pointers = pointerDown(pointers, p1)
            pointers = pointerDown(pointers, p2)
            pointers = pointerDown(pointers, p3)
            expect(pointers).toEqual({
                kind: Kind.THREE_OR_MORE_POINTERS,
                pointers: { [p1.id]: p1, [p2.id]: p2, [p3.id]: p3 },
            })
        })
    )
})

test("transition from three pointers to four pointers", () => {
    fc.assert(
        fc.property(PointersArb(4), ([p1, p2, p3, p4]) => {
            let pointers: Pointers = { kind: Kind.NO_POINTER }
            pointers = pointerDown(pointers, p1)
            pointers = pointerDown(pointers, p2)
            pointers = pointerDown(pointers, p3)
            pointers = pointerDown(pointers, p4)
            expect(pointers).toEqual({
                kind: Kind.THREE_OR_MORE_POINTERS,
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

test("transition from four pointers to three pointers", () => {
    fc.assert(
        fc.property(PointersArb(4), ([p1, p2, p3, p4]) => {
            let pointers: Pointers = { kind: Kind.NO_POINTER }
            pointers = pointerDown(pointers, p1)
            pointers = pointerDown(pointers, p2)
            pointers = pointerDown(pointers, p3)
            pointers = pointerDown(pointers, p4)
            pointers = pointerUp(pointers, p1)
            expect(pointers).toEqual({
                kind: Kind.THREE_OR_MORE_POINTERS,
                pointers: {
                    [p2.id]: p2,
                    [p3.id]: p3,
                    [p4.id]: p4,
                },
            })
        })
    )
})

test("transition from three pointers to two pointers", () => {
    fc.assert(
        fc.property(PointersArb(3), ([p1, p2, p3]) => {
            let pointers: Pointers = { kind: Kind.NO_POINTER }
            pointers = pointerDown(pointers, p1)
            pointers = pointerDown(pointers, p2)
            pointers = pointerDown(pointers, p3)
            pointers = pointerUp(pointers, p1)
            expect(pointers).toEqual({
                kind: Kind.TWO_POINTERS,
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

test("transition from two pointers to one pointer", () => {
    fc.assert(
        fc.property(PointersArb(2), ([p1, p2]) => {
            let pointers: Pointers = { kind: Kind.NO_POINTER }
            pointers = pointerDown(pointers, p1)
            pointers = pointerDown(pointers, p2)
            pointers = pointerUp(pointers, p1)
            expect(pointers).toEqual({
                kind: Kind.ONE_POINTER,
                pointer: p2,
            })
        })
    )
})

test("transition from one pointer to no pointers", () => {
    fc.assert(
        fc.property(PointerArb, (p1) => {
            let pointers: Pointers = { kind: Kind.NO_POINTER }
            pointers = pointerDown(pointers, p1)
            pointers = pointerUp(pointers, p1)
            expect(pointers).toEqual({ kind: Kind.NO_POINTER })
        })
    )
})

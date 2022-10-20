import { test, expect } from "vitest"
import * as fc from "fast-check"
import { Arbitrary } from "fast-check"

type Vec2 = [number, number]

interface Pointer {
    id: number
    pos: Vec2
}

type Pointers = { [id: number]: Pointer }

const pointerDown = (pointers: Pointers, pointer: Pointer): Pointers => ({
    ...pointers,
    [pointer.id]: pointer,
})

const pointerUp = (pointers: Pointers, pointer: Pointer): Pointers => {
    const { [pointer.id]: _, ...rest } = pointers
    return rest
}

const PointerArb: Arbitrary<Pointer> = fc
    .tuple(fc.integer(), fc.integer(), fc.integer())
    .map(([id, x, y]) => ({ id, pos: [x, y] }))

const PointersArb = (n: number): Arbitrary<Pointer[]> =>
    fc
        .array(PointerArb, { minLength: n, maxLength: n })
        .filter((pointers) => new Set(pointers.map(({ id }) => id)).size === n)

test("pointer down adds pointer to pointers", () => {
    fc.assert(
        fc.property(PointersArb(3), ([p1, p2, p3]) => {
            let pointers: Pointers = {}
            pointers = pointerDown(pointers, p1)
            expect(pointers).toEqual({ [p1.id]: p1 })
            pointers = pointerDown(pointers, p2)
            expect(pointers).toEqual({ [p1.id]: p1, [p2.id]: p2 })
            pointers = pointerDown(pointers, p3)
            expect(pointers).toEqual({ [p1.id]: p1, [p2.id]: p2, [p3.id]: p3 })
        })
    )
})

test("pointer up removes pointer from pointers", () => {
    fc.assert(
        fc.property(PointersArb(3), ([p1, p2, p3]) => {
            let pointers: Pointers = {}
            pointers = pointerDown(pointers, p1)
            pointers = pointerDown(pointers, p2)
            pointers = pointerDown(pointers, p3)
            pointers = pointerUp(pointers, p1)
            expect(pointers).toEqual({ [p2.id]: p2, [p3.id]: p3 })
            pointers = pointerUp(pointers, p2)
            expect(pointers).toEqual({ [p3.id]: p3 })
            pointers = pointerUp(pointers, p3)
            expect(pointers).toEqual({})
        })
    )
})

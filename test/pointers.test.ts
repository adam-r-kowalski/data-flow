import { test, expect } from "vitest"
import * as fc from "fast-check"
import { Arbitrary } from "fast-check"
import { distance, midpoint, sub, Vec2 } from "../src/vec2"
import { Pointer, PointerTarget, TargetKind } from "../src/pointer"
import * as pointer from "../src/pointer"
import * as camera from "../src/camera"
import "./almostEqual"

const Vec2Arb: Arbitrary<Vec2> = fc.tuple(fc.integer(), fc.integer())

const PointerArb: Arbitrary<Pointer> = fc
    .tuple(fc.integer(), Vec2Arb)
    .map(([id, pos]) => ({ id, pos }))

const PointersArb = (n: number): Arbitrary<Pointer[]> =>
    fc
        .array(PointerArb, { minLength: n, maxLength: n })
        .filter((pointers) => new Set(pointers.map(({ id }) => id)).size === n)

const target: PointerTarget = { kind: TargetKind.BACKGROUND }

test("pointer down with no pointers", () => {
    fc.assert(
        fc.property(PointerArb, (p1) => {
            const kind = "pointer/down"
            let actual = { pointers: pointer.initial }
            actual = pointer.down(actual, { kind, pointer: p1, target })
            const expected = {
                pointers: {
                    kind: pointer.Kind.ONE,
                    pointer: p1,
                    target: target,
                },
            }
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("pointer down with no pointers where target is node", () => {
    fc.assert(
        fc.property(PointerArb, (p1) => {
            const kind = "pointer/down"
            const target = { kind: TargetKind.NODE, uuid: "node" }
            let actual = { pointers: pointer.initial }
            actual = pointer.down(actual, { kind, pointer: p1, target })
            const expected = {
                pointers: {
                    kind: pointer.Kind.ONE,
                    pointer: p1,
                    target: target,
                },
            }
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("pointer down with one pointer", () => {
    fc.assert(
        fc.property(PointersArb(2), ([p1, p2]) => {
            const kind = "pointer/down"
            let actual = { pointers: pointer.initial }
            actual = pointer.down(actual, { kind, pointer: p1, target })
            actual = pointer.down(actual, { kind, pointer: p2, target })
            const expected = {
                pointers: {
                    kind: pointer.Kind.TWO,
                    pointers: { [p1.id]: p1, [p2.id]: p2 },
                    midpoint: midpoint(p1.pos, p2.pos),
                    distance: distance(p1.pos, p2.pos),
                },
            }
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("pointer down with two pointers", () => {
    fc.assert(
        fc.property(PointersArb(3), ([p1, p2, p3]) => {
            const kind = "pointer/down"
            let actual = { pointers: pointer.initial }
            actual = pointer.down(actual, { kind, pointer: p1, target })
            actual = pointer.down(actual, { kind, pointer: p2, target })
            actual = pointer.down(actual, { kind, pointer: p3, target })
            const expected = {
                pointers: {
                    kind: pointer.Kind.THREE_OR_MORE,
                    pointers: { [p1.id]: p1, [p2.id]: p2, [p3.id]: p3 },
                },
            }
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("pointer down with three pointers", () => {
    fc.assert(
        fc.property(PointersArb(4), ([p1, p2, p3, p4]) => {
            const kind = "pointer/down"
            let actual = { pointers: pointer.initial }
            actual = pointer.down(actual, { kind, pointer: p1, target })
            actual = pointer.down(actual, { kind, pointer: p2, target })
            actual = pointer.down(actual, { kind, pointer: p3, target })
            actual = pointer.down(actual, { kind, pointer: p4, target })
            const expected = {
                pointers: {
                    kind: pointer.Kind.THREE_OR_MORE,
                    pointers: {
                        [p1.id]: p1,
                        [p2.id]: p2,
                        [p3.id]: p3,
                        [p4.id]: p4,
                    },
                },
            }
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("pointer up with four pointers", () => {
    fc.assert(
        fc.property(PointersArb(4), ([p1, p2, p3, p4]) => {
            const kind = "pointer/down"
            let actual = { pointers: pointer.initial }
            actual = pointer.down(actual, { kind, pointer: p1, target })
            actual = pointer.down(actual, { kind, pointer: p2, target })
            actual = pointer.down(actual, { kind, pointer: p3, target })
            actual = pointer.down(actual, { kind, pointer: p4, target })
            actual = pointer.up(actual, { kind: "pointer/up", id: p1.id })
            const expected = {
                pointers: {
                    kind: pointer.Kind.THREE_OR_MORE,
                    pointers: {
                        [p2.id]: p2,
                        [p3.id]: p3,
                        [p4.id]: p4,
                    },
                },
            }
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("pointer up with three pointers", () => {
    fc.assert(
        fc.property(PointersArb(3), ([p1, p2, p3]) => {
            const kind = "pointer/down"
            let actual = { pointers: pointer.initial }
            actual = pointer.down(actual, { kind, pointer: p1, target })
            actual = pointer.down(actual, { kind, pointer: p2, target })
            actual = pointer.down(actual, { kind, pointer: p3, target })
            actual = pointer.up(actual, { kind: "pointer/up", id: p1.id })
            const expected = {
                pointers: {
                    kind: pointer.Kind.TWO,
                    pointers: {
                        [p2.id]: p2,
                        [p3.id]: p3,
                    },
                    midpoint: midpoint(p2.pos, p3.pos),
                    distance: distance(p2.pos, p3.pos),
                },
            }
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("pointer up with two pointers", () => {
    fc.assert(
        fc.property(PointersArb(2), ([p1, p2]) => {
            const kind = "pointer/down"
            let actual = { pointers: pointer.initial }
            actual = pointer.down(actual, { kind, pointer: p1, target })
            actual = pointer.down(actual, { kind, pointer: p2, target })
            actual = pointer.up(actual, { kind: "pointer/up", id: p1.id })
            const expected = {
                pointers: {
                    kind: pointer.Kind.ONE,
                    pointer: p2,
                    target,
                },
            }
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("pointer up with one pointer", () => {
    fc.assert(
        fc.property(PointerArb, (p1) => {
            const kind = "pointer/down"
            let actual = { pointers: pointer.initial }
            actual = pointer.down(actual, { kind, pointer: p1, target })
            actual = pointer.up(actual, { kind: "pointer/up", id: p1.id })
            const expected = { pointers: pointer.initial }
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("pointer up with no pointers throws", () => {
    fc.assert(
        fc.property(fc.integer(), (id) => {
            let actual = { pointers: pointer.initial }
            expect(() =>
                pointer.up(actual, { kind: "pointer/up", id })
            ).toThrow("pointer up when no pointers are down")
        })
    )
})

test("pointer move when no pointer.down", () => {
    fc.assert(
        fc.property(PointerArb, (p) => {
            let actual = {
                pointers: pointer.initial,
                camera: camera.initial,
                graph: {
                    nodes: {},
                    edges: {},
                },
            }
            actual = pointer.move(actual, { kind: "pointer/move", pointer: p })
            const expected = {
                pointers: pointer.initial,
                camera: camera.initial,
                graph: {
                    nodes: {},
                    edges: {},
                },
            }
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("pointer move when one pointer down", () => {
    fc.assert(
        fc.property(PointerArb, Vec2Arb, (p, pos) => {
            let actual = {
                pointers: pointer.initial,
                camera: camera.initial,
                graph: {
                    nodes: {},
                    edges: {},
                },
            }
            actual = pointer.down(actual, {
                kind: "pointer/down",
                pointer: p,
                target,
            })
            actual = pointer.move(actual, {
                kind: "pointer/move",
                pointer: { id: p.id, pos },
            })
            let expected = {
                pointers: {
                    kind: pointer.Kind.ONE,
                    pointer: { id: p.id, pos },
                    target,
                },
                camera: camera.initial,
                graph: {
                    nodes: {},
                    edges: {},
                },
            }
            expected = camera.drag(expected, {
                kind: "camera/drag",
                drag: sub(p.pos, pos),
            })
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("pointer move when two pointers down", () => {
    fc.assert(
        fc.property(PointersArb(2), Vec2Arb, ([p1, p2], pos) => {
            let actual = {
                pointers: pointer.initial,
                camera: camera.initial,
                graph: {
                    nodes: {},
                    edges: {},
                },
            }
            actual = pointer.down(actual, {
                kind: "pointer/down",
                pointer: p1,
                target,
            })
            actual = pointer.down(actual, {
                kind: "pointer/down",
                pointer: p2,
                target,
            })
            actual = pointer.move(actual, {
                kind: "pointer/move",
                pointer: { id: p1.id, pos },
            })
            let expected = {
                pointers: {
                    kind: pointer.Kind.TWO,
                    pointers: { [p1.id]: { id: p1.id, pos }, [p2.id]: p2 },
                    midpoint: midpoint(pos, p2.pos),
                    distance: distance(pos, p2.pos),
                },
                camera: camera.initial,
                graph: {
                    nodes: {},
                    edges: {},
                },
            }
            expected = camera.zoom(expected, {
                kind: "camera/zoom",
                delta: distance(p1.pos, p2.pos) - distance(pos, p2.pos),
                pan: sub(midpoint(p1.pos, p2.pos), midpoint(pos, p2.pos)),
                pos: midpoint(pos, p2.pos),
            })
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("pointer move when three pointers down", () => {
    fc.assert(
        fc.property(PointersArb(3), Vec2Arb, ([p1, p2, p3], pos) => {
            let actual = {
                pointers: pointer.initial,
                camera: camera.initial,
                graph: {
                    nodes: {},
                    edges: {},
                },
            }
            actual = pointer.down(actual, {
                kind: "pointer/down",
                pointer: p1,
                target,
            })
            actual = pointer.down(actual, {
                kind: "pointer/down",
                pointer: p2,
                target,
            })
            actual = pointer.down(actual, {
                kind: "pointer/down",
                pointer: p3,
                target,
            })
            actual = pointer.move(actual, {
                kind: "pointer/move",
                pointer: { id: p1.id, pos },
            })
            const expected = {
                pointers: {
                    kind: pointer.Kind.THREE_OR_MORE,
                    pointers: {
                        [p1.id]: { id: p1.id, pos },
                        [p2.id]: p2,
                        [p3.id]: p3,
                    },
                },
                camera: camera.initial,
                graph: {
                    nodes: {},
                    edges: {},
                },
            }
            expect(actual).toEqual(expected)
        })
    )
})

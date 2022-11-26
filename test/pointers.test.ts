import { test, expect, vi } from "vitest"
import * as fc from "fast-check"
import { Arbitrary } from "fast-check"

import { distance, midpoint, sub, Vec2, zero } from "../src/vec2"
import { Mat3x3 } from "../src/mat3x3"
import { Between, Edge, Graph, Node, UUID } from "../src/Graph/graph"
import { Camera } from "../src/camera"
import { Root } from "../src/Graph/root"
import "./almost_equal"
import {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    Pointer,
    PointerData,
    PointersKind,
    Target,
    TargetKind,
} from "../src/Graph/pointers"
import { Value } from "../src/value"

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
            let pointers: PointerData = { kind: PointersKind.ZERO }
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
            }
            let pointers: PointerData = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, pointer, target)
            const expected: PointerData = {
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
            let pointers: PointerData = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            pointers = onPointerDown(pointers, p2, target)
            const expected: PointerData = {
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
            let pointers: PointerData = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            pointers = onPointerDown(pointers, p2, target)
            pointers = onPointerDown(pointers, p3, target)
            const expected: PointerData = {
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
            let pointers: PointerData = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            pointers = onPointerDown(pointers, p2, target)
            pointers = onPointerDown(pointers, p3, target)
            pointers = onPointerDown(pointers, p4, target)
            const expected: PointerData = {
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
            let pointers: PointerData = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            pointers = onPointerDown(pointers, p2, target)
            pointers = onPointerDown(pointers, p3, target)
            pointers = onPointerDown(pointers, p4, target)
            pointers = onPointerUp(pointers, p4)
            const expected: PointerData = {
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
            let pointers: PointerData = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            pointers = onPointerDown(pointers, p2, target)
            pointers = onPointerDown(pointers, p3, target)
            pointers = onPointerUp(pointers, p3)
            const expected: PointerData = {
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
            let pointers: PointerData = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            pointers = onPointerDown(pointers, p2, target)
            pointers = onPointerUp(pointers, p2)
            const expected: PointerData = {
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
            let pointers: PointerData = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, pointer, target)
            pointers = onPointerUp(pointers, pointer)
            const expected: PointerData = { kind: PointersKind.ZERO }
            expect(pointers).toAlmostEqual(expected)
        })
    )
})

const mockRoot = (): Root => ({
    set: vi.fn<[HTMLElement], void>(),
    offset: () => [0, 0],
    fullOffset: () => [0, 0],
})

const mockCamera = (): Camera => ({
    position: () => zero,
    zoom: () => 1,
    transform: vi.fn<[], Mat3x3>(),
    drag: vi.fn<[Vec2], void>(),
    pinch: vi.fn<[Vec2, number], void>(),
    worldSpace: vi.fn<[Vec2], Vec2>(),
})

const mockGraph = (): Graph => ({
    database: {
        nodes: {},
        edges: {},
        inputs: {},
        outputs: {},
        bodies: {},
    },
    dragNode: vi.fn<[UUID, Vec2, number], void>(),
    addNode: vi.fn<[string, Vec2], Node>(),
    addEdge: vi.fn<[Between], Edge | undefined>(),
    setValue: vi.fn<[UUID, Value], void>(),
    subscribe: vi.fn<[(nodeId: UUID) => void], void>(),
    deleteNode: vi.fn<[UUID], void>(),
    deleteInputEdge: vi.fn<[UUID], void>(),
    deleteOutputEdges: vi.fn<[UUID], void>(),
    replaceNode: vi.fn<[UUID, string], void>(),
    untrackLabel: vi.fn<[UUID, string], void>(),
})

test("pointer move with no pointers down", () => {
    fc.assert(
        fc.property(PointerArb, (pointer) => {
            const root = mockRoot()
            const camera = mockCamera()
            const graph = mockGraph()
            let pointers: PointerData = { kind: PointersKind.ZERO }
            const actual = onPointerMove(pointers, pointer, root, camera, graph)
            expect(actual).toAlmostEqual({ kind: PointersKind.ZERO })
        })
    )
})

test("pointer move with one pointer down where target is background", () => {
    fc.assert(
        fc.property(PointerArb, Vec2Arb, (p1, position) => {
            const root = mockRoot()
            const camera = mockCamera()
            const graph = mockGraph()
            const target: Target = { kind: TargetKind.BACKGROUND }
            let pointers: PointerData = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            const p2 = { ...p1, position }
            const actual = onPointerMove(pointers, p2, root, camera, graph)
            expect(actual).toAlmostEqual({
                kind: PointersKind.ONE,
                pointer: p2,
                target,
            })
            expect(camera.drag).toHaveBeenCalledWith(
                sub(p2.position, p1.position)
            )
        })
    )
})

test("pointer move with one pointer down where target is node", () => {
    fc.assert(
        fc.property(PointerArb, Vec2Arb, (p1, position) => {
            const root = mockRoot()
            const camera = mockCamera()
            const graph = mockGraph()
            const target: Target = {
                kind: TargetKind.NODE,
                id: 0,
            }
            let pointers: PointerData = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            const p2 = { ...p1, position }
            const actual = onPointerMove(pointers, p2, root, camera, graph)
            expect(actual).toAlmostEqual({
                kind: PointersKind.ONE,
                pointer: p2,
                target,
            })
            expect(graph.dragNode).toHaveBeenCalledWith(
                target.id,
                sub(p2.position, p1.position),
                1
            )
        })
    )
})

test("pointer move with two pointers down", () => {
    fc.assert(
        fc.property(PointersArb(2), Vec2Arb, ([p1, p2], position) => {
            const root = mockRoot()
            const camera = mockCamera()
            const graph = mockGraph()
            const target: Target = { kind: TargetKind.BACKGROUND }
            let pointers: PointerData = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            pointers = onPointerDown(pointers, p2, target)
            const p3 = { ...p1, position }
            const actual = onPointerMove(pointers, p3, root, camera, graph)
            const oldMidpoint = midpoint(p1.position, p2.position)
            const oldDistance = distance(p1.position, p2.position)
            const newMidpoint = midpoint(p3.position, p2.position)
            const newDistance = distance(p3.position, p2.position)
            expect(actual).toAlmostEqual({
                kind: PointersKind.TWO,
                data: { [p1.id]: p3, [p2.id]: p2 },
                midpoint: newMidpoint,
                distance: newDistance,
            })
            expect(camera.drag).toHaveBeenCalledWith(
                sub(newMidpoint, oldMidpoint)
            )
            expect(camera.pinch).toHaveBeenCalledWith(
                newMidpoint,
                oldDistance - newDistance
            )
        })
    )
})

test("pointer move with three pointers down", () => {
    fc.assert(
        fc.property(PointersArb(3), Vec2Arb, ([p1, p2, p3], position) => {
            const root = mockRoot()
            const camera = mockCamera()
            const graph = mockGraph()
            const target: Target = { kind: TargetKind.BACKGROUND }
            let pointers: PointerData = { kind: PointersKind.ZERO }
            pointers = onPointerDown(pointers, p1, target)
            pointers = onPointerDown(pointers, p2, target)
            pointers = onPointerDown(pointers, p3, target)
            const p4 = { ...p1, position }
            const actual = onPointerMove(pointers, p4, root, camera, graph)
            expect(actual).toAlmostEqual({
                kind: PointersKind.THREE_OR_MORE,
                data: { [p1.id]: p4, [p2.id]: p2, [p3.id]: p3 },
            })
        })
    )
})

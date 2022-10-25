import { test, expect } from "vitest"
import * as fc from "fast-check"
import { Arbitrary } from "fast-check"
import { add, Vec2 } from "../src/vec2"
import * as camera from "../src/camera"
import { HasCamera } from "../src/camera"
import "./almostEqual"

const Vec2Arb: Arbitrary<Vec2> = fc.tuple(fc.integer(), fc.integer())

const CameraArb = (config: {
    min: number
    max: number
}): Arbitrary<HasCamera> =>
    fc
        .tuple(fc.integer(config), Vec2Arb)
        .map(([zoom, pos]) => ({ camera: { zoom, pos } }))

test("move camera", () => {
    fc.assert(
        fc.property(CameraArb({ min: 1, max: 5 }), Vec2Arb, (model, drag) => {
            const kind = "camera/drag"
            const actual = camera.drag(model, { kind, drag })
            const expected = {
                camera: {
                    zoom: model.camera.zoom,
                    pos: add(model.camera.pos, drag),
                },
            }
            expect(actual).toAlmostEqual(expected)
        })
    )
})

test("zoom camera into current position without going over min or max zoom", () => {
    fc.assert(
        fc.property(
            CameraArb({ min: 1, max: 1 }),
            fc.integer({ min: -400, max: 80 }),
            (model, delta) => {
                const actual = camera.zoom(model, {
                    kind: "camera/zoom",
                    delta,
                    pos: model.camera.pos,
                    pan: [0, 0],
                })
                const expected = {
                    camera: {
                        zoom: model.camera.zoom * (1 - delta * 0.01),
                        pos: model.camera.pos,
                    },
                }
                expect(actual).toAlmostEqual(expected)
            }
        )
    )
})

test("zoom camera into current position going over max zoom", () => {
    fc.assert(
        fc.property(
            CameraArb({ min: 1, max: 1 }),
            fc.integer({ min: -100000, max: -500 }),
            (model, delta) => {
                const actual = camera.zoom(model, {
                    kind: "camera/zoom",
                    delta,
                    pos: model.camera.pos,
                    pan: [0, 0],
                })
                const expected = {
                    camera: {
                        zoom: 5,
                        pos: model.camera.pos,
                    },
                }
                expect(actual).toAlmostEqual(expected)
            }
        )
    )
})

test("zoom camera into current position going over min zoom", () => {
    fc.assert(
        fc.property(
            CameraArb({ min: 1, max: 1 }),
            fc.integer({ min: 100, max: 100000 }),
            (model, delta) => {
                const actual = camera.zoom(model, {
                    kind: "camera/zoom",
                    delta,
                    pos: model.camera.pos,
                    pan: [0, 0],
                })
                const expected = {
                    camera: {
                        zoom: 0.1,
                        pos: model.camera.pos,
                    },
                }
                expect(actual).toAlmostEqual(expected)
            }
        )
    )
})

test("zoom camera into position above and to the right of current position", () => {
    fc.assert(
        fc.property(
            CameraArb({ min: 1, max: 1 }),
            fc.integer({ min: -100, max: -10 }),
            fc.integer({ min: 1, max: 10 }),
            (model, delta, d) => {
                const [x, y] = model.camera.pos
                const actual = camera.zoom(model, {
                    kind: "camera/zoom",
                    delta,
                    pos: [x + d, y + d],
                    pan: [0, 0],
                })
                expect(actual.camera.zoom).toAlmostEqual(
                    model.camera.zoom * (1 - delta * 0.01)
                )
                expect(actual.camera.pos[0]).toBeLessThan(model.camera.pos[0])
                expect(actual.camera.pos[1]).toBeLessThan(model.camera.pos[1])
            }
        )
    )
})

test("zoom camera into position above and to the left of current position", () => {
    fc.assert(
        fc.property(
            CameraArb({ min: 1, max: 1 }),
            fc.integer({ min: -100, max: -10 }),
            fc.integer({ min: 1, max: 10 }),
            (model, delta, d) => {
                const [x, y] = model.camera.pos
                const actual = camera.zoom(model, {
                    kind: "camera/zoom",
                    delta,
                    pos: [x - d, y + d],
                    pan: [0, 0],
                })
                expect(actual.camera.zoom).toAlmostEqual(
                    model.camera.zoom * (1 - delta * 0.01)
                )
                expect(actual.camera.pos[0]).toBeGreaterThan(
                    model.camera.pos[0]
                )
                expect(actual.camera.pos[1]).toBeLessThan(model.camera.pos[1])
            }
        )
    )
})

test("zoom camera into position below and to the left of current position", () => {
    fc.assert(
        fc.property(
            CameraArb({ min: 1, max: 1 }),
            fc.integer({ min: -100, max: -10 }),
            fc.integer({ min: 1, max: 10 }),
            (model, delta, d) => {
                const [x, y] = model.camera.pos
                const actual = camera.zoom(model, {
                    kind: "camera/zoom",
                    delta,
                    pos: [x - d, y - d],
                    pan: [0, 0],
                })
                expect(actual.camera.zoom).toAlmostEqual(
                    model.camera.zoom * (1 - delta * 0.01)
                )
                expect(actual.camera.pos[0]).toBeGreaterThan(
                    model.camera.pos[0]
                )
                expect(actual.camera.pos[1]).toBeGreaterThan(
                    model.camera.pos[1]
                )
            }
        )
    )
})

test("zoom camera into position below and to the right of current position", () => {
    fc.assert(
        fc.property(
            CameraArb({ min: 1, max: 1 }),
            fc.integer({ min: -100, max: -10 }),
            fc.integer({ min: 1, max: 10 }),
            (model, delta, d) => {
                const [x, y] = model.camera.pos
                const actual = camera.zoom(model, {
                    kind: "camera/zoom",
                    delta,
                    pos: [x + d, y - d],
                    pan: [0, 0],
                })
                expect(actual.camera.zoom).toAlmostEqual(
                    model.camera.zoom * (1 - delta * 0.01)
                )
                expect(actual.camera.pos[0]).toBeLessThan(model.camera.pos[0])
                expect(actual.camera.pos[1]).toBeGreaterThan(
                    model.camera.pos[1]
                )
            }
        )
    )
})

test("zoom camera out of position below and to the right of current position", () => {
    fc.assert(
        fc.property(
            CameraArb({ min: 1, max: 1 }),
            fc.integer({ min: 10, max: 80 }),
            fc.integer({ min: 1, max: 10 }),
            (model, delta, d) => {
                const [x, y] = model.camera.pos
                const actual = camera.zoom(model, {
                    kind: "camera/zoom",
                    delta,
                    pos: [x + d, y - d],
                    pan: [0, 0],
                })
                expect(actual.camera.zoom).toAlmostEqual(
                    model.camera.zoom * (1 - delta * 0.01)
                )
                expect(actual.camera.pos[0]).toBeGreaterThan(
                    model.camera.pos[0]
                )
                expect(actual.camera.pos[1]).toBeLessThan(model.camera.pos[1])
            }
        )
    )
})

test("zoom camera out of position below and to the left of current position", () => {
    fc.assert(
        fc.property(
            CameraArb({ min: 1, max: 1 }),
            fc.integer({ min: 10, max: 80 }),
            fc.integer({ min: 1, max: 10 }),
            (model, delta, d) => {
                const [x, y] = model.camera.pos
                const actual = camera.zoom(model, {
                    kind: "camera/zoom",
                    delta,
                    pos: [x - d, y - d],
                    pan: [0, 0],
                })
                expect(actual.camera.zoom).toAlmostEqual(
                    model.camera.zoom * (1 - delta * 0.01)
                )
                expect(actual.camera.pos[0]).toBeLessThan(model.camera.pos[0])
                expect(actual.camera.pos[1]).toBeLessThan(model.camera.pos[1])
            }
        )
    )
})

test("zoom camera out of position above and to the left of current position", () => {
    fc.assert(
        fc.property(
            CameraArb({ min: 1, max: 1 }),
            fc.integer({ min: 10, max: 80 }),
            fc.integer({ min: 1, max: 10 }),
            (model, delta, d) => {
                const [x, y] = model.camera.pos
                const actual = camera.zoom(model, {
                    kind: "camera/zoom",
                    delta,
                    pos: [x - d, y + d],
                    pan: [0, 0],
                })
                expect(actual.camera.zoom).toAlmostEqual(
                    model.camera.zoom * (1 - delta * 0.01)
                )
                expect(actual.camera.pos[0]).toBeLessThan(model.camera.pos[0])
                expect(actual.camera.pos[1]).toBeGreaterThan(
                    model.camera.pos[1]
                )
            }
        )
    )
})

test("zoom camera out of position above and to the right of current position", () => {
    fc.assert(
        fc.property(
            CameraArb({ min: 1, max: 1 }),
            fc.integer({ min: 10, max: 80 }),
            fc.integer({ min: 1, max: 10 }),
            (model, delta, d) => {
                const [x, y] = model.camera.pos
                const actual = camera.zoom(model, {
                    kind: "camera/zoom",
                    delta,
                    pos: [x + d, y + d],
                    pan: [0, 0],
                })
                expect(actual.camera.zoom).toAlmostEqual(
                    model.camera.zoom * (1 - delta * 0.01)
                )
                expect(actual.camera.pos[0]).toBeGreaterThan(
                    model.camera.pos[0]
                )
                expect(actual.camera.pos[1]).toBeGreaterThan(
                    model.camera.pos[1]
                )
            }
        )
    )
})
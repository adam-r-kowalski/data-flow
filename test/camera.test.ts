import { test, expect } from "vitest"
import * as fc from "fast-check"
import { Arbitrary } from "fast-check"
import { add, Vec2 } from "../src/vec2"
import { Camera, moveCamera, zoomCamera } from "../src/camera"

const Vec2Arb: Arbitrary<Vec2> = fc.tuple(fc.integer(), fc.integer())

const CameraArb = (config: { min: number; max: number }): Arbitrary<Camera> =>
    fc.tuple(fc.integer(config), Vec2Arb).map(([zoom, pos]) => ({ zoom, pos }))

test("move camera", () => {
    fc.assert(
        fc.property(CameraArb({ min: 1, max: 5 }), Vec2Arb, (camera, drag) => {
            const actual = moveCamera(camera, drag)
            const expected = {
                zoom: camera.zoom,
                pos: add(camera.pos, drag),
            }
            expect(actual).toEqual(expected)
        })
    )
})

test("zoom camera into current position without going over min or max zoom", () => {
    fc.assert(
        fc.property(
            CameraArb({ min: 1, max: 1 }),
            fc.integer({ min: -400, max: 80 }),
            (camera, delta) => {
                const actual = zoomCamera(camera, { delta, pos: camera.pos })
                const expected: Camera = {
                    zoom: camera.zoom * (1 - delta * 0.01),
                    pos: camera.pos,
                }
                expect(actual).toEqual(expected)
            }
        )
    )
})

test("zoom camera into current position going over max zoom", () => {
    fc.assert(
        fc.property(
            CameraArb({ min: 1, max: 1 }),
            fc.integer({ min: -100000, max: -500 }),
            (camera, delta) => {
                const actual = zoomCamera(camera, { delta, pos: camera.pos })
                const expected: Camera = {
                    zoom: 5,
                    pos: camera.pos,
                }
                expect(actual).toEqual(expected)
            }
        )
    )
})

test("zoom camera into current position going over min zoom", () => {
    fc.assert(
        fc.property(
            CameraArb({ min: 1, max: 1 }),
            fc.integer({ min: 100, max: 100000 }),
            (camera, delta) => {
                const actual = zoomCamera(camera, { delta, pos: camera.pos })
                const expected: Camera = {
                    zoom: 0.1,
                    pos: camera.pos,
                }
                expect(actual).toEqual(expected)
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
            (camera, delta, d) => {
                const [x, y] = camera.pos
                const actual = zoomCamera(camera, {
                    delta,
                    pos: [x + d, y + d],
                })
                expect(actual.zoom).toEqual(camera.zoom * (1 - delta * 0.01))
                expect(actual.pos[0]).toBeLessThan(camera.pos[0])
                expect(actual.pos[1]).toBeLessThan(camera.pos[1])
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
            (camera, delta, d) => {
                const [x, y] = camera.pos
                const actual = zoomCamera(camera, {
                    delta,
                    pos: [x - d, y + d],
                })
                expect(actual.zoom).toEqual(camera.zoom * (1 - delta * 0.01))
                expect(actual.pos[0]).toBeGreaterThan(camera.pos[0])
                expect(actual.pos[1]).toBeLessThan(camera.pos[1])
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
            (camera, delta, d) => {
                const [x, y] = camera.pos
                const actual = zoomCamera(camera, {
                    delta,
                    pos: [x - d, y - d],
                })
                expect(actual.zoom).toEqual(camera.zoom * (1 - delta * 0.01))
                expect(actual.pos[0]).toBeGreaterThan(camera.pos[0])
                expect(actual.pos[1]).toBeGreaterThan(camera.pos[1])
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
            (camera, delta, d) => {
                const [x, y] = camera.pos
                const actual = zoomCamera(camera, {
                    delta,
                    pos: [x + d, y - d],
                })
                expect(actual.zoom).toEqual(camera.zoom * (1 - delta * 0.01))
                expect(actual.pos[0]).toBeLessThan(camera.pos[0])
                expect(actual.pos[1]).toBeGreaterThan(camera.pos[1])
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
            (camera, delta, d) => {
                const [x, y] = camera.pos
                const actual = zoomCamera(camera, {
                    delta,
                    pos: [x + d, y - d],
                })
                expect(actual.zoom).toEqual(camera.zoom * (1 - delta * 0.01))
                expect(actual.pos[0]).toBeGreaterThan(camera.pos[0])
                expect(actual.pos[1]).toBeLessThan(camera.pos[1])
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
            (camera, delta, d) => {
                const [x, y] = camera.pos
                const actual = zoomCamera(camera, {
                    delta,
                    pos: [x - d, y - d],
                })
                expect(actual.zoom).toEqual(camera.zoom * (1 - delta * 0.01))
                expect(actual.pos[0]).toBeLessThan(camera.pos[0])
                expect(actual.pos[1]).toBeLessThan(camera.pos[1])
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
            (camera, delta, d) => {
                const [x, y] = camera.pos
                const actual = zoomCamera(camera, {
                    delta,
                    pos: [x - d, y + d],
                })
                expect(actual.zoom).toEqual(camera.zoom * (1 - delta * 0.01))
                expect(actual.pos[0]).toBeLessThan(camera.pos[0])
                expect(actual.pos[1]).toBeGreaterThan(camera.pos[1])
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
            (camera, delta, d) => {
                const [x, y] = camera.pos
                const actual = zoomCamera(camera, {
                    delta,
                    pos: [x + d, y + d],
                })
                expect(actual.zoom).toEqual(camera.zoom * (1 - delta * 0.01))
                expect(actual.pos[0]).toBeGreaterThan(camera.pos[0])
                expect(actual.pos[1]).toBeGreaterThan(camera.pos[1])
            }
        )
    )
})

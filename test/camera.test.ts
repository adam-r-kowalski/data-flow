import { test, expect } from "vitest"
import * as fc from "fast-check"
import { Arbitrary } from "fast-check"
import { add, Vec2 } from "../src/vec2"
import { Camera, moveCamera } from "../src/camera"

const Vec2Arb: Arbitrary<Vec2> = fc.tuple(fc.integer(), fc.integer())

const CameraArb: Arbitrary<Camera> = fc
    .tuple(fc.integer(), Vec2Arb)
    .map(([zoom, pos]) => ({ zoom, pos }))

test("move camera", () => {
    fc.assert(
        fc.property(CameraArb, Vec2Arb, (camera, drag) => {
            const actual = moveCamera(camera, drag)
            const expected = {
                zoom: camera.zoom,
                pos: add(camera.pos, drag),
            }
            expect(actual).toEqual(expected)
        })
    )
})

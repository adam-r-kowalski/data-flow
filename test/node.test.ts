import { test, expect } from "vitest"
import { moveNode } from "../src/nodes"

test("move node", () => {
    const nodes = {
        "0": {
            uuid: "0",
            x: 10,
            y: 15,
        },
    }
    const event = {
        uuid: "0",
        dx: 50,
        dy: 30,
    }
    const actual = moveNode(nodes, event)
    const expected = {
        "0": {
            uuid: "0",
            x: 60,
            y: 45,
        },
    }
    expect(actual).toEqual(expected)
})

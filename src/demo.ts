import { Model } from "./model"
import { PointersKind } from "./pointers"

export const demoModel: Model = {
    nodes: {
        "node-0": {
            uuid: "node-0",
            name: "number",
            pos: [25, 25],
            inputs: [],
            outputs: [{ uuid: "node-0-output-0", name: "out" }],
            value: 5,
        },
        "node-1": {
            uuid: "node-1",
            name: "number",
            pos: [25, 150],
            inputs: [],
            outputs: [{ uuid: "node-1-output-0", name: "out" }],
            value: 12,
        },
        "node-2": {
            uuid: "node-2",
            name: "add",
            pos: [200, 85],
            inputs: [
                { uuid: "node-2-input-0", name: "x" },
                { uuid: "node-2-input-1", name: "y" },
            ],
            outputs: [{ uuid: "node-2-output-0", name: "out" }],
            value: 17,
        },
    },
    edges: {
        "edge-0": {
            uuid: "edge-0",
            input: "node-2-input-0",
            output: "node-0-output-0",
        },
        "edge-1": {
            uuid: "edge-1",
            input: "node-2-input-1",
            output: "node-1-output-0",
        },
    },
    boundingBoxes: {},
    camera: { zoom: 1, pos: [0, 0] },
    pointers: { kind: PointersKind.NO_POINTER },
    window: [window.innerWidth, window.innerHeight],
}

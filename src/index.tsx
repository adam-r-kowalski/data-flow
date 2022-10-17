import { createSignal, For, onCleanup } from "solid-js"
import { render } from "solid-js/web"

import { Background, Zoom } from "./Background"
import { BoundingBoxChanged, DragNode, NodeCard } from "./NodeCard"
import { BezierCurves, Paths } from "./BezierCurves"
import { Drag } from "./drag"
import { moveNode, Nodes } from "./nodes"
import { Camera } from "./camera"
import { BoundingBox } from "./track_bounding_box"
import { Menu } from "./Menu"

export const createNodes = (): Nodes => {
    return {
        "node-0": {
            uuid: "node-0",
            name: "number",
            x: 25,
            y: 25,
            inputs: [],
            outputs: [{ uuid: "node-0-output-0", name: "out" }],
            value: 5,
        },
        "node-1": {
            uuid: "node-1",
            name: "number",
            x: 25,
            y: 150,
            inputs: [],
            outputs: [{ uuid: "node-1-output-0", name: "out" }],
            value: 12,
        },
        "node-2": {
            uuid: "node-2",
            name: "add",
            x: 200,
            y: 85,
            inputs: [
                { uuid: "node-2-input-0", name: "x" },
                { uuid: "node-2-input-1", name: "y" },
            ],
            outputs: [{ uuid: "node-2-output-0", name: "out" }],
            value: 17,
        },
    }
}

export interface Edge {
    uuid: string
    input: string
    output: string
}

export type Edges = { [uuid: string]: Edge }

export const createEdges = (): Edges => {
    return {
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
    }
}

export const moveCamera = (camera: Camera, drag: Drag): Camera => ({
    x: camera.x + drag.dx,
    y: camera.y + drag.dy,
    zoom: camera.zoom,
})

export type BoundingBoxes = { [uuid: string]: BoundingBox }

const createBoundingBoxes = (nodes: Nodes): BoundingBoxes => {
    const boxes: BoundingBoxes = {}
    const el: HTMLElement = document.createElement("div")
    for (const node of Object.values(nodes)) {
        for (const input of node.inputs) {
            boxes[input.uuid] = { x: 0, y: 0, width: 0, height: 0, el }
        }
        for (const output of node.outputs) {
            boxes[output.uuid] = { x: 0, y: 0, width: 0, height: 0, el }
        }
    }
    return boxes
}

const App = () => {
    const [nodes, setNodes] = createSignal(createNodes())
    const edges = createEdges()
    const [camera, setCamera] = createSignal({ x: 0, y: 0, zoom: 1 })
    const [boundingBoxes, setBoundingBoxes] = createSignal(
        createBoundingBoxes(nodes())
    )
    const onDragNode = (drag: DragNode) => {
        const zoom = camera().zoom
        const scaled = {
            uuid: drag.uuid,
            dx: drag.dx / zoom,
            dy: drag.dy / zoom,
        }
        setNodes(moveNode(nodes(), scaled))
    }
    const onDragBackground = (drag: Drag) => {
        const c = camera()
        const scaled = { dx: drag.dx * c.zoom, dy: drag.dy * c.zoom }
        setCamera(moveCamera(c, scaled))
        const boxes: BoundingBoxes = {}
        for (const [uuid, box] of Object.entries(boundingBoxes())) {
            const { x, y, width, height } = box.el.getBoundingClientRect()
            boxes[uuid] = { x, y, width, height, el: box.el }
        }
        setBoundingBoxes(boxes)
    }
    const onZoomBackground = (zoom: Zoom) => {
        console.log(zoom)
    }
    const onBoundingBox = (change: BoundingBoxChanged) => {
        const boxes = boundingBoxes()
        setBoundingBoxes({ ...boxes, [change.uuid]: change.box })
    }
    const transform = () => {
        const { x, y, zoom } = camera()
        return `translate(${x}px, ${y}px) scale(${zoom}, ${zoom})`
    }
    const paths = (): Paths => {
        const boxes = boundingBoxes()
        return Object.values(edges).map((edge) => {
            const inputBox = boxes[edge.input]
            const outputBox = boxes[edge.output]
            const x0 = outputBox.x + outputBox.width / 2
            const y0 = outputBox.y + outputBox.height / 2
            const x1 = inputBox.x + inputBox.width / 2
            const y1 = inputBox.y + inputBox.height / 2
            return {
                p0: { x: x0, y: y0 },
                p1: { x: x0 + 50, y: y0 },
                p2: { x: x1 - 50, y: y1 },
                p3: { x: x1, y: y1 },
            }
        })
    }

    const [size, setSize] = createSignal({
        width: window.innerWidth,
        height: window.innerHeight,
    })
    const onResize = () => {
        setSize({
            width: window.innerWidth,
            height: window.innerHeight,
        })
    }
    window.addEventListener("resize", onResize)

    onCleanup(() => {
        window.removeEventListener("resize", onResize)
    })

    return (
        <div>
            <Background onDrag={onDragBackground} onZoom={onZoomBackground} />
            <BezierCurves paths={paths()} size={size()} />
            <div
                style={{
                    position: "absolute",
                    transform: transform(),
                }}
            >
                <For each={Object.values(nodes())}>
                    {(node) => (
                        <NodeCard
                            node={node}
                            onDrag={onDragNode}
                            onDragBackground={onDragBackground}
                            onBoundingBox={onBoundingBox}
                        />
                    )}
                </For>
            </div>
            <Menu size={size()} />
        </div>
    )
}

render(() => <App />, document.getElementById("root")!)

document.addEventListener("wheel", (e) => e.preventDefault(), {
    passive: false,
})

document.addEventListener("contextmenu", (e) => e.preventDefault())

import { createSignal, For } from "solid-js"
import { render } from "solid-js/web"

import { Background, Zoom } from "./Background"
import { BoundingBoxChanged, DragNode, NodeCard } from "./NodeCard"
import { BezierCurves } from "./BezierCurves"
import { Drag } from "./drag"
import { moveNode, Nodes } from "./nodes"
import { BoundingBox } from "./track_bounding_box"
import { Camera } from "./camera"

export const createNodes = (): Nodes => {
    return {
        "node-0": {
            uuid: "node-0",
            name: "number",
            x: 25,
            y: 25,
            inputs: [],
            outputs: [{ uuid: "node-0-output-0", name: "out" }],
        },
        "node-1": {
            uuid: "node-1",
            name: "number",
            x: 25,
            y: 150,
            inputs: [],
            outputs: [{ uuid: "node-1-output-0", name: "out" }],
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
        },
    }
}

export const moveCamera = (camera: Camera, drag: Drag): Camera => ({
    x: camera.x + drag.dx,
    y: camera.y + drag.dy,
    zoom: camera.zoom,
})

type BoundingBoxes = { [uuid: string]: BoundingBox }

const createBoundingBoxes = (nodes: Nodes): BoundingBoxes => {
    const boxes: BoundingBoxes = {}
    for (const node of Object.values(nodes)) {
        for (const input of node.inputs) {
            boxes[input.uuid] = { x: 0, y: 0, width: 0, height: 0 }
        }
        for (const output of node.outputs) {
            boxes[output.uuid] = { x: 0, y: 0, width: 0, height: 0 }
        }
    }
    return boxes
}

const App = () => {
    const [nodes, setNodes] = createSignal(createNodes())
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
            boxes[uuid] = {
                x: box.x + scaled.dx,
                y: box.y + scaled.dy,
                width: box.width,
                height: box.height,
            }
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
    return (
        <div>
            <Background onDrag={onDragBackground} onZoom={onZoomBackground} />
            <div
                style={{
                    position: "absolute",
                    transform: transform(),
                    //zoom: zoom(),
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
            <BezierCurves boxes={Object.values(boundingBoxes())} />
        </div>
    )
}

render(() => <App />, document.getElementById("root")!)

document.addEventListener("wheel", (e) => e.preventDefault(), {
    passive: false,
})

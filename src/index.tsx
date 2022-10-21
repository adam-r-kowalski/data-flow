import { createSignal, For, onCleanup } from "solid-js"
import { render } from "solid-js/web"

import { Background } from "./Background"
import { BoundingBoxChanged, DragNode, NodeCard } from "./NodeCard"
import { BezierCurves, Paths } from "./BezierCurves"
import { moveNode, Nodes } from "./nodes"
import { Camera } from "./camera"
import { BoundingBox } from "./track_bounding_box"
import { Menu } from "./Menu"
import { Mat3x3, matMul, scale, translate } from "./mat3x3"
import {
    pointerDown,
    pointerMove,
    PointerMoveKind,
    Pointers,
    PointersKind,
    PointerTarget,
    PointerTargetKind,
    pointerUp,
} from "./pointers"

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

interface Drag {
    dx: number
    dy: number
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

interface Zoom {
    delta: number
    x: number
    y: number
}

const zoomCamera = (camera: Camera, zoom: Zoom): Camera => {
    const { x, y, zoom: s } = camera
    if ((s <= 0.1 && zoom.delta > 0) || (s >= 5 && zoom.delta < 0))
        return camera
    const transform: Mat3x3 = [s, 0, x, 0, s, y, 0, 0, 1]
    const newTransform = [
        translate(zoom.x, zoom.y),
        scale(1 - zoom.delta * 0.01),
        translate(-zoom.x, -zoom.y),
        transform,
    ].reduce(matMul)
    return {
        x: newTransform[2],
        y: newTransform[5],
        zoom: newTransform[0],
    }
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
            dx: -drag.dx / zoom,
            dy: -drag.dy / zoom,
        }
        setNodes(moveNode(nodes(), scaled))
    }
    const onDragBackground = (drag: Drag) => {
        const c = camera()
        const scaled = { dx: -drag.dx, dy: -drag.dy }
        setCamera(moveCamera(c, scaled))
        const boxes: BoundingBoxes = {}
        for (const [uuid, box] of Object.entries(boundingBoxes())) {
            const { x, y, width, height } = box.el.getBoundingClientRect()
            boxes[uuid] = { x, y, width, height, el: box.el }
        }
        setBoundingBoxes(boxes)
    }
    const onZoomBackground = (zoom: Zoom) => {
        setCamera(zoomCamera(camera(), zoom))
        const boxes: BoundingBoxes = {}
        for (const [uuid, box] of Object.entries(boundingBoxes())) {
            const { x, y, width, height } = box.el.getBoundingClientRect()
            boxes[uuid] = { x, y, width, height, el: box.el }
        }
        setBoundingBoxes(boxes)
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
                p1: { x: x0 + 50 * camera().zoom, y: y0 },
                p2: { x: x1 - 50 * camera().zoom, y: y1 },
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

    const onWheel = (e: WheelEvent) => {
        e.preventDefault()
        e.ctrlKey
            ? onZoomBackground({
                  delta: e.deltaY,
                  x: e.clientX,
                  y: e.clientY,
              })
            : onDragBackground({ dx: e.deltaX, dy: e.deltaY })
    }

    document.addEventListener("wheel", onWheel, {
        passive: false,
    })

    const onContextMenu = (e: MouseEvent) => e.preventDefault()

    document.addEventListener("contextmenu", onContextMenu)

    const [pointers, setPointers] = createSignal<Pointers>({
        kind: PointersKind.NO_POINTER,
    })

    const onPointerDown = (event: PointerEvent, target: PointerTarget) => {
        setPointers(
            pointerDown(
                pointers(),
                {
                    id: event.pointerId,
                    pos: [event.clientX, event.clientY],
                },
                target
            )
        )
    }

    const onPointerUp = (event: PointerEvent) => {
        setPointers(pointerUp(pointers(), event.pointerId))
    }

    const onPointerMove = (event: PointerEvent) => {
        const result = pointerMove(pointers(), {
            id: event.pointerId,
            pos: [event.clientX, event.clientY],
        })
        setPointers(result.pointers)
        switch (result.kind) {
            case PointerMoveKind.DRAG:
                const target = result.target
                const [dx, dy] = result.delta
                switch (target.kind) {
                    case PointerTargetKind.BACKGROUND:
                        onDragBackground({ dx, dy })
                        break
                    case PointerTargetKind.NODE:
                        onDragNode({ dx, dy, uuid: target.uuid })
                        break
                }
            case PointerMoveKind.IGNORE:
                break
        }
    }

    document.addEventListener("pointerup", onPointerUp)
    document.addEventListener("pointermove", onPointerMove)

    onCleanup(() => {
        window.removeEventListener("resize", onResize)
        document.removeEventListener("wheel", onWheel)
        document.removeEventListener("contextmenu", onContextMenu)
        document.removeEventListener("pointerup", onPointerUp)
        document.removeEventListener("pointermove", onPointerMove)
    })

    return (
        <div>
            <Background
                onPointerDown={(e) =>
                    onPointerDown(e, { kind: PointerTargetKind.BACKGROUND })
                }
            />
            <BezierCurves paths={paths()} size={size()} zoom={camera().zoom} />
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
                            onPointerDown={(e) =>
                                onPointerDown(e, {
                                    kind: PointerTargetKind.NODE,
                                    uuid: node.uuid,
                                })
                            }
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

import { createSignal, For } from "solid-js"
import { render } from "solid-js/web"
import { Background, Zoom } from "./Background"
import { Drag } from "./drag"

import { DragNode, NodeCard } from "./NodeCard"
import { moveNode, Nodes } from "./nodes"

export const createNodes = (): Nodes => {
    return {
        "0": {
            uuid: "0",
            title: "number",
            x: 25,
            y: 25,
            inputs: [],
            outputs: ["out"],
        },
        "1": {
            uuid: "1",
            title: "number",
            x: 25,
            y: 150,
            inputs: [],
            outputs: ["out"],
        },
        "2": {
            uuid: "2",
            title: "add",
            x: 200,
            y: 85,
            inputs: ["x", "y"],
            outputs: ["out"],
        },
    }
}

interface Camera {
    x: number
    y: number
    zoom: number
}

export const moveCamera = (camera: Camera, drag: Drag): Camera => ({
    x: camera.x + drag.dx / camera.zoom,
    y: camera.y + drag.dy / camera.zoom,
    zoom: camera.zoom,
})

const clamp = (value: number, min: number, max: number): number =>
    Math.max(min, Math.min(max, value))

export const zoomCamera = (camera: Camera, zoom: Zoom): Camera => {
    const newZoom = clamp(camera.zoom * Math.pow(2, zoom.delta * -0.01), 0.5, 5)
    return {
        x: camera.x,
        y: camera.y,
        zoom: newZoom,
    }
}

const App = () => {
    const [nodes, setNodes] = createSignal(createNodes())
    const [camera, setCamera] = createSignal({ x: 0, y: 0, zoom: 1 })
    const onDragNode = (drag: DragNode) => {
        setNodes(moveNode(nodes(), camera().zoom, drag))
    }
    const onDragBackground = (drag: Drag) => {
        setCamera(moveCamera(camera(), drag))
    }
    const onZoomBackground = (zoom: Zoom) => {
        setCamera(zoomCamera(camera(), zoom))
    }
    const transform = () => {
        const { x, y } = camera()
        return `translate(${x}px, ${y}px)`
    }
    const zoom = () => `${camera().zoom * 100}%`
    return (
        <div>
            <Background onDrag={onDragBackground} onZoom={onZoomBackground} />
            <div
                style={{
                    position: "absolute",
                    transform: transform(),
                    zoom: zoom(),
                }}
            >
                <For each={Object.values(nodes())}>
                    {(node) => (
                        <NodeCard
                            node={node}
                            onDrag={onDragNode}
                            onDragBackground={onDragBackground}
                        />
                    )}
                </For>
            </div>
        </div>
    )
}

render(() => <App />, document.getElementById("root")!)

document.addEventListener("wheel", (e) => e.preventDefault(), {
    passive: false,
})

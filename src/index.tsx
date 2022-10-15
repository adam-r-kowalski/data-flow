import { createSignal, For } from "solid-js"
import { render } from "solid-js/web"
import { Background } from "./Background"
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
}

export const moveCamera = (camera: Camera, drag: Drag): Camera => ({
    x: camera.x + drag.dx,
    y: camera.y + drag.dy,
})

const App = () => {
    const [nodes, setNodes] = createSignal(createNodes(10))
    const [camera, setCamera] = createSignal({ x: 0, y: 0 })
    const onDragNode = (drag: DragNode) => {
        setNodes(moveNode(nodes(), drag))
    }
    const onDragBackground = (drag: Drag) => {
        setCamera(moveCamera(camera(), drag))
    }
    const transform = () => {
        const { x, y } = camera()
        return `translate(${x}px, ${y}px)`
    }
    return (
        <div>
            <Background onDrag={onDragBackground} onZoom={console.log} />
            <div style={{ position: "absolute", transform: transform() }}>
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

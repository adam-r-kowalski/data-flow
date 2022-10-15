import { createSignal, For } from "solid-js"
import { render } from "solid-js/web"
import { Background } from "./Background"
import { Drag } from "./drag"

import { DragNode, NodeCard } from "./NodeCard"
import { moveNode, Nodes } from "./nodes"

export const createNodes = (n: number): Nodes => {
    const nodes: Nodes = {}
    for (let i = 0; i < n; ++i) {
        nodes[i] = {
            uuid: i.toString(),
            x: Math.random() * (window.innerWidth - 150),
            y: Math.random() * (window.innerHeight - 150),
        }
    }
    return nodes
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

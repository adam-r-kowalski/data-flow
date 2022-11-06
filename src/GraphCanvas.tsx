import { onCleanup } from "solid-js"
import { styled } from "solid-styled-components"

import { Graph } from "./graph"
import { BezierCurves } from "./BezierCurves"
import { Camera } from "./camera"
import { NodeCards } from "./NodeCards"
import { createPositions } from "./positions"
import { createPointers } from "./pointers"
import { sub } from "./vec2"
import { createRoot } from "./root"
import { Finder } from "./finder"

const FullScreen = styled("div")({
    overflow: "hidden",
    position: "relative",
    width: "100%",
    height: "100%",
    background: "#24283b",
    "background-size": "40px 40px",
    "background-image":
        "radial-gradient(circle, #3b4261 1px, rgba(0, 0, 0, 0) 1px)",
})

interface Props {
    graph: Graph
    camera: Camera
    finder: Finder
}

interface ExtendedWheelEvent extends WheelEvent {
    wheelDeltaY?: number
}

export const GraphCanvas = (props: Props) => {
    const root = createRoot()
    const positions = createPositions()
    const pointers = createPointers()
    document.addEventListener("pointerup", pointers.up)
    const onPointerMove = (e: PointerEvent) => {
        pointers.move(e, {
            camera: props.camera,
            dragNode: (id, delta) => {
                props.graph.dragNode(id, delta, props.camera.zoom())
                positions.retrack(id, props.graph, props.camera, root.offset())
            },
            offset: root.offset,
        })
    }
    document.addEventListener("pointermove", onPointerMove)
    onCleanup(() => {
        document.removeEventListener("pointerup", pointers.up)
        document.removeEventListener("pointermove", onPointerMove)
    })
    const onWheel = (e: ExtendedWheelEvent) => {
        e.preventDefault()
        const isTouchPad = e.wheelDeltaY
            ? e.wheelDeltaY === -3 * e.deltaY
            : e.deltaMode === 0
        if (!isTouchPad && !e.ctrlKey) {
            props.camera.pinch(
                sub([e.clientX, e.clientY], root.fullOffset()),
                -e.deltaY
            )
        } else if (!e.ctrlKey) {
            props.camera.drag([-e.deltaX, -e.deltaY])
        } else {
            props.camera.pinch(
                sub([e.clientX, e.clientY], root.fullOffset()),
                e.deltaY
            )
        }
    }
    return (
        <FullScreen
            ref={root.set}
            onPointerDown={pointers.downOnBackground}
            onWheel={onWheel}
            onContextMenu={(e) => e.preventDefault()}
            onDblClick={props.finder.show}
        >
            <BezierCurves
                edges={props.graph.edges}
                camera={props.camera}
                positions={positions}
            />
            <NodeCards
                nodes={props.graph.nodes}
                graph={props.graph}
                camera={props.camera}
                positions={positions}
                pointers={pointers}
                offset={root.offset}
            />
        </FullScreen>
    )
}

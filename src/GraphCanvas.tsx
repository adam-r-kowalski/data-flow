import { createSignal, onCleanup } from "solid-js"
import { styled } from "solid-styled-components"

import { Graph } from "./graph"
import { BezierCurves } from "./BezierCurves"
import { Camera } from "./camera"
import { NodeCards } from "./NodeCards"
import { createPositions } from "./positions"
import { createPointers } from "./pointers"
import { sub, Vec2 } from "./vec2"
import { createRoot } from "./root"
import { Finder } from "./finder"
import { Menu } from "./menu"
import { Modifiers } from "./modifiers"

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
    menu: Menu
    modifiers: Modifiers
}

export const GraphCanvas = (props: Props) => {
    const root = createRoot()
    const positions = createPositions()
    const pointers = createPointers()
    const [down, setDown] = createSignal(false)
    const onPointerUp = (e: PointerEvent) => {
        setDown(false)
        if (e.button === 1) {
            props.modifiers.setWheel(false)
        } else {
            pointers.up(e)
        }
    }
    const onPointerMove = (e: PointerEvent) => {
        setDown(false)
        const position: Vec2 = [e.clientX, e.clientY]
        if (props.menu.visible()) return
        if (props.modifiers.wheel()) {
            const delta = sub(position, props.modifiers.position())
            props.camera.drag(delta)
        } else if (
            props.modifiers.space() ||
            pointers.draggingNode() ||
            pointers.twoPointersDown()
        ) {
            pointers.move(e, {
                camera: props.camera,
                dragNode: (id, delta) => {
                    props.graph.dragNode(id, delta, props.camera.zoom())
                    positions.retrack(
                        id,
                        props.graph,
                        props.camera,
                        root.offset()
                    )
                },
                offset: root.offset,
            })
        }
        props.modifiers.setPosition(position)
    }
    document.addEventListener("pointerup", onPointerUp)
    document.addEventListener("pointermove", onPointerMove)
    onCleanup(() => {
        document.removeEventListener("pointerup", onPointerUp)
        document.removeEventListener("pointermove", onPointerMove)
    })
    const onWheel = (e: WheelEvent) => {
        e.preventDefault()
        if (e.ctrlKey || e.metaKey) {
            props.camera.pinch(
                sub([e.clientX, e.clientY], root.fullOffset()),
                e.deltaY
            )
        } else if (e.shiftKey) {
            props.camera.drag([-e.deltaX - e.deltaY, 0])
        } else {
            props.camera.drag([-e.deltaX, -e.deltaY])
        }
    }
    const cursor = () =>
        props.modifiers.space() || props.modifiers.wheel() ? "grab" : "default"
    const onPointerDown = (e: PointerEvent) => {
        if (e.button === 0) {
            pointers.downOnBackground(e)
            setDown(true)
            setTimeout(() => {
                if (down()) props.menu.show([e.clientX, e.clientY])
            }, 300)
        } else if (e.button === 1) {
            props.modifiers.setWheel(true)
            props.modifiers.setPosition([e.clientX, e.clientY])
        }
    }
    return (
        <FullScreen
            ref={root.set}
            onPointerDown={onPointerDown}
            onWheel={onWheel}
            onContextMenu={(e) => {
                e.preventDefault()
                props.menu.show([e.clientX, e.clientY])
            }}
            onDblClick={props.finder.show}
            style={{ cursor: cursor() }}
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

import { createSignal, onCleanup } from "solid-js"
import { styled } from "solid-styled-components"
import { FiSearch, FiMinus } from "solid-icons/fi"
import { TbNumbers } from "solid-icons/tb"
import { VsAdd } from "solid-icons/vs"

import { Graph } from "./graph"
import { BezierCurves } from "./BezierCurves"
import { NodeCards } from "./NodeCards"
import { createPositions } from "./positions"
import { createPointers } from "./pointers"
import { sub, Vec2 } from "./vec2"
import { createRoot } from "./root"
import { createSelected } from "./selected"
import { useFinder } from "./Finder"
import { useMenu } from "./Menu"
import { useCamera } from "./camera"

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
}

export const GraphCanvas = (props: Props) => {
    const finder = useFinder()!
    const menu = useMenu()!
    const camera = useCamera()!
    const root = createRoot()
    const positions = createPositions(props.graph, camera, root)
    const pointers = createPointers(camera)
    const [down, setDown] = createSignal(false)
    const selected = createSelected(props.graph)
    const onPointerUp = (e: PointerEvent) => {
        setDown(false)
        pointers.up(e)
    }
    const onPointerMove = (e: PointerEvent) => {
        setDown(false)
        if (menu.visible()) return
        pointers.move(e, {
            dragNode: (id, delta) => {
                props.graph.dragNode(id, delta, camera.zoom())
            },
            offset: root.offset,
        })
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
            camera.pinch(
                sub([e.clientX, e.clientY], root.fullOffset()),
                e.deltaY
            )
        } else if (e.shiftKey) {
            camera.drag([-e.deltaX - e.deltaY, 0])
        } else {
            camera.drag([-e.deltaX, -e.deltaY])
        }
    }
    const addNode = (name: string, position: Vec2) => {
        props.graph.addNode(name, camera.worldSpace(position))
    }

    const showMenu = (position: Vec2) => {
        menu.show({
            position,
            options: [
                { icon: FiSearch, onClick: () => finder.show(position) },
                {
                    icon: TbNumbers,
                    onClick: () => addNode("number", position),
                },
                {
                    icon: VsAdd,
                    onClick: () => addNode("add", position),
                },
                {
                    icon: FiMinus,
                    onClick: () => addNode("sub", position),
                },
            ],
        })
    }
    const onPointerDown = (e: PointerEvent) => {
        selected.clear()
        if (e.button === 0) {
            pointers.downOnBackground(e)
            setDown(true)
            setTimeout(() => {
                if (down()) showMenu([e.clientX, e.clientY])
            }, 300)
        }
    }
    return (
        <FullScreen
            ref={root.set}
            onPointerDown={onPointerDown}
            onWheel={onWheel}
            onContextMenu={(e) => {
                e.preventDefault()
                showMenu([e.clientX, e.clientY])
            }}
        >
            <BezierCurves edges={props.graph.edges} positions={positions} />
            <NodeCards
                nodes={props.graph.nodes}
                graph={props.graph}
                positions={positions}
                pointers={pointers}
                root={root}
                selected={selected}
            />
        </FullScreen>
    )
}

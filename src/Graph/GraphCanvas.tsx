import { createSignal, onCleanup } from "solid-js"
import { styled } from "solid-styled-components"
import { FiSearch, FiMinus } from "solid-icons/fi"
import { TbNumbers } from "solid-icons/tb"
import { VsAdd } from "solid-icons/vs"
import { BiRegularSelection } from "solid-icons/bi"

import { BezierCurves } from "./BezierCurves"
import { NodeCards } from "./NodeCards"
import { PointersProvider, usePointers } from "./pointers"
import { sub, Vec2 } from "../vec2"
import { RootProvider, useRoot } from "./root"
import { SelectedProvider, useSelected } from "./selected"
import { useFinder } from "../Finder"
import { useMenu } from "../Menu"
import { useCamera } from "../camera"
import { useGraph } from "./GraphProvider"
import { PositionsProvider } from "./positions"
import { FinderModeKind } from "../Finder/finder"

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

const Content = () => {
    const finder = useFinder()!
    const menu = useMenu()!
    const camera = useCamera()!
    const graph = useGraph()!
    const pointers = usePointers()!
    const selected = useSelected()!
    const root = useRoot()!
    const [down, setDown] = createSignal(false)
    const [position, setPosition] = createSignal<Vec2>([0, 0])
    const [middleMouse, setMiddleMouse] = createSignal(false)
    const onPointerUp = (e: PointerEvent) => {
        if (e.button === 0) {
            setDown(false)
            pointers.up(e)
        } else if (e.button === 1) {
            setMiddleMouse(false)
        }
    }
    const onPointerMove = (e: PointerEvent) => {
        setDown(false)
        if (menu.visible()) return
        if (middleMouse()) {
            const current: Vec2 = [e.clientX, e.clientY]
            const delta = sub(current, position())
            setPosition(current)
            camera.drag(delta)
        } else {
            pointers.move(e)
        }
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
    const addNode = (name: string, position: Vec2) => () =>
        graph.addNode(name, camera.worldSpace(position))
    const showMenu = (position: Vec2) => {
        menu.show({
            position,
            options: [
                {
                    icon: BiRegularSelection,
                    label: "select",
                    onClick: () => console.log("select"),
                },
                {
                    icon: FiSearch,
                    label: "search",
                    onClick: () =>
                        finder.show({ kind: FinderModeKind.INSERT, position }),
                },
                {
                    icon: TbNumbers,
                    label: "number",
                    onClick: addNode("number", position),
                },
                {
                    icon: VsAdd,
                    label: "add",
                    onClick: addNode("add", position),
                },
                {
                    icon: FiMinus,
                    label: "sub",
                    onClick: addNode("sub", position),
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
        } else if (e.button === 1) {
            setMiddleMouse(true)
            setPosition([e.clientX, e.clientY])
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
            <BezierCurves />
            <NodeCards />
        </FullScreen>
    )
}

export const GraphCanvas = () => {
    return (
        <RootProvider>
            <PositionsProvider>
                <PointersProvider>
                    <SelectedProvider>
                        <Content />
                    </SelectedProvider>
                </PointersProvider>
            </PositionsProvider>
        </RootProvider>
    )
}

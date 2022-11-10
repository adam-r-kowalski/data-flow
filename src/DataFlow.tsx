import { onCleanup } from "solid-js"
import { styled } from "solid-styled-components"

import { createCamera } from "./camera"
import { createGraph } from "./graph"
import { GraphCanvas } from "./GraphCanvas"
import { FinderPane } from "./FinderPane"
import { createFinder } from "./finder"
import { RadialMenu } from "./RadialMenu"
import { createMenu } from "./menu"
import { createModifiers } from "./modifiers"
import { operations } from "./operations"

const FullScreen = styled("div")({
    width: "100vw",
    height: "100vh",
})

export const DataFlow = () => {
    const graph = createGraph()
    const camera = createCamera()
    const finder = createFinder(Object.keys(operations))
    const menu = createMenu()
    const modifiers = createModifiers()
    const onKeyDown = (e: KeyboardEvent) => {
        if (finder.visible() || menu.visible()) return
        switch (e.key) {
            case "f":
                e.preventDefault()
                return finder.show([
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                ])
            case " ":
                modifiers.setSpace(true)
                return
            default:
                return
        }
    }
    const onKeyUp = (e: KeyboardEvent) => {
        if (finder.visible() || menu.visible()) return
        if (e.key == " ") {
            modifiers.setSpace(false)
        }
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("keyup", onKeyUp)
    onCleanup(() => document.removeEventListener("keyup", onKeyUp))
    return (
        <FullScreen>
            <GraphCanvas
                graph={graph}
                camera={camera}
                finder={finder}
                menu={menu}
                modifiers={modifiers}
            />
            <FinderPane graph={graph} camera={camera} finder={finder} />
            <RadialMenu graph={graph} camera={camera} menu={menu} />
        </FullScreen>
    )
}

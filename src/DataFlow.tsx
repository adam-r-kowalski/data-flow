import { onCleanup } from "solid-js"
import { styled } from "solid-styled-components"

import { createCamera } from "./camera"
import { createGraph } from "./graph"
import { GraphCanvas } from "./GraphCanvas"
import { FinderPane } from "./FinderPane"
import { createFinder } from "./finder"
import { RadialMenu } from "./RadialMenu"
import { createMenu } from "./menu"
import { operations } from "./operations"
import { demoScene } from "./demo_scene"

const FullScreen = styled("div")({
    width: "100vw",
    height: "100vh",
})

export const DataFlow = () => {
    const graph = createGraph(requestAnimationFrame)
    demoScene(graph)
    const camera = createCamera()
    const finder = createFinder(Object.keys(operations))
    const menu = createMenu()
    const onKeyDown = (e: KeyboardEvent) => {
        if (finder.visible() || menu.visible()) return
        switch (e.key) {
            case "f":
                e.preventDefault()
                return finder.show([
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                ])
            default:
                return
        }
    }
    document.addEventListener("keydown", onKeyDown)
    onCleanup(() => document.removeEventListener("keydown", onKeyDown))
    return (
        <FullScreen>
            <GraphCanvas
                graph={graph}
                camera={camera}
                finder={finder}
                menu={menu}
            />
            <FinderPane graph={graph} camera={camera} finder={finder} />
            <RadialMenu menu={menu} />
        </FullScreen>
    )
}

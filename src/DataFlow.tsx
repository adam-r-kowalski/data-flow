import { onCleanup } from "solid-js"
import { styled } from "solid-styled-components"

import { createCamera } from "./camera"
import { createGraph } from "./graph"
import { GraphCanvas } from "./GraphCanvas"
import { FinderPane, FinderProvider, useFinder } from "./Finder"
import { RadialMenu, MenuProvider, useMenu } from "./Menu"
import { demoScene } from "./demo_scene"

const FullScreen = styled("div")({
    width: "100vw",
    height: "100vh",
})

export const DataFlow = () => {
    const graph = createGraph(requestAnimationFrame)
    demoScene(graph)
    const camera = createCamera()
    const Content = () => {
        const finder = useFinder()!
        const menu = useMenu()!
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
            <>
                <GraphCanvas graph={graph} camera={camera} />
                <FinderPane graph={graph} camera={camera} />
                <RadialMenu />
            </>
        )
    }
    return (
        <FinderProvider>
            <MenuProvider>
                <FullScreen>
                    <Content />
                </FullScreen>
            </MenuProvider>
        </FinderProvider>
    )
}

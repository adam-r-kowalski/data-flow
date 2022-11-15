import { onCleanup } from "solid-js"
import { styled } from "solid-styled-components"

import { CameraProvider } from "./camera"
import { createGraph, GraphProvider } from "./Graph"
import { FinderPane, FinderProvider, useFinder } from "./Finder"
import { RadialMenu, MenuProvider, useMenu } from "./Menu"
import { demoScene } from "./demo_scene"
import { GraphCanvas } from "./Graph/GraphCanvas"
import { MeasureTextProvider } from "./MeasureText"

const FullScreen = styled("div")({
    width: "100vw",
    height: "100vh",
})

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
            <GraphCanvas />
            <FinderPane />
            <RadialMenu />
        </>
    )
}

export const DataFlow = () => {
    const graph = createGraph()
    demoScene(graph)
    return (
        <GraphProvider graph={graph}>
            <CameraProvider>
                <FinderProvider>
                    <MenuProvider>
                        <MeasureTextProvider>
                            <FullScreen>
                                <Content />
                            </FullScreen>
                        </MeasureTextProvider>
                    </MenuProvider>
                </FinderProvider>
            </CameraProvider>
        </GraphProvider>
    )
}

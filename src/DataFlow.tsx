import { onCleanup } from "solid-js"
import { styled } from "solid-styled-components"

import { CameraProvider } from "./camera"
import { Graph, GraphProvider } from "./Graph"
import { FinderPane, FinderProvider, useFinder } from "./Finder"
import { RadialMenu, MenuProvider, useMenu } from "./Menu"
import { GraphCanvas } from "./Graph/GraphCanvas"
import { FinderModeKind } from "./Finder/finder"

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
                return finder.show({
                    kind: FinderModeKind.INSERT,
                    position: [window.innerWidth / 2, window.innerHeight / 2],
                })
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

interface Props {
    graph: Graph
}

export const DataFlow = (props: Props) => {
    return (
        <GraphProvider graph={props.graph}>
            <CameraProvider>
                <FinderProvider>
                    <MenuProvider>
                        <FullScreen>
                            <Content />
                        </FullScreen>
                    </MenuProvider>
                </FinderProvider>
            </CameraProvider>
        </GraphProvider>
    )
}

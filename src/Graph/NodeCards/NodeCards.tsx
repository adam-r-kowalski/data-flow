import { For } from "solid-js"
import { styled } from "solid-styled-components"

import { useCamera } from "../../camera"
import { useGraph } from "../GraphProvider"
import { NodeCard } from "./NodeCard"

const Scene = styled("div")({
    "transform-origin": "top left",
})

export const NodeCards = () => {
    const camera = useCamera()!
    const graph = useGraph()!
    const translate = () => {
        const [x, y] = camera.position()
        return `translate(${x}px, ${y}px)`
    }
    const scale = () => `scale(${camera.zoom()}, ${camera.zoom()})`
    const transform = () => `${translate()} ${scale()}`
    return (
        <Scene style={{ transform: transform() }}>
            <For each={Object.values(graph.database.nodes)}>
                {(node) => <NodeCard node={node} />}
            </For>
        </Scene>
    )
}

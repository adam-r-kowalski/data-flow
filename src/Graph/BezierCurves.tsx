import { For } from "solid-js"

import { Positions } from "./positions"
import { UUID } from "./graph"
import { styled } from "solid-styled-components"
import { useCamera } from "../camera"
import { useGraph } from "./GraphProvider"

const FullScreen = styled("svg")({
    width: "100%",
    height: "100%",
    position: "absolute",
    "pointer-events": "none",
})

interface Props {
    positions: Positions
}

export const BezierCurves = (props: Props) => {
    const graph = useGraph()!
    const camera = useCamera()!
    const translate = () => {
        const [x, y] = camera.position()
        return `translate(${x} ${y})`
    }
    const scale = () => `scale(${camera.zoom()} ${camera.zoom()})`
    const transform = () => `${translate()} ${scale()}`
    const d = (output: UUID, input: UUID) => {
        const [x0, y0] = props.positions.position(output)
        const [x3, y3] = props.positions.position(input)
        const right = x0 < x3
        const delta = Math.min(Math.abs(x3 - x0), 50)
        const x1 = right ? x0 + delta : x0 - delta
        const x2 = right ? x3 - delta : x3 + delta
        const y1 = y0
        const y2 = y3
        return `M${x0},${y0} C${x1},${y1} ${x2},${y2} ${x3},${y3}`
    }
    return (
        <FullScreen>
            <g transform={transform()}>
                <For each={Object.values(graph.edges)}>
                    {(edge) => {
                        return (
                            <path
                                fill="none"
                                stroke="#7aa2f7"
                                stroke-width="3"
                                d={d(edge.output, edge.input)}
                            />
                        )
                    }}
                </For>
            </g>
        </FullScreen>
    )
}

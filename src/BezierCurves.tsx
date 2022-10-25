import { For } from "solid-js"
import { Edges } from "./edges"
import { BoundingBoxes } from "./graph"
import { Vec2 } from "./vec2"

export interface Point {
    x: number
    y: number
}

export interface Path {
    p0: Point
    p1: Point
    p2: Point
    p3: Point
}

export type Paths = Path[]

interface Props {
    edges: Edges
    boxes: BoundingBoxes
    window: Vec2
    zoom: number
}

export const BezierCurves = (props: Props) => {
    const paths = (): Paths => {
        const result: Paths = []
        for (const edge of Object.values(props.edges)) {
            const inputBox = props.boxes[edge.input]
            const outputBox = props.boxes[edge.output]
            if (!inputBox || !outputBox) continue
            const x0 = outputBox.x + outputBox.width / 2
            const y0 = outputBox.y + outputBox.height / 2
            const x1 = inputBox.x + inputBox.width / 2
            const y1 = inputBox.y + inputBox.height / 2
            result.push({
                p0: { x: x0, y: y0 },
                p1: { x: x0 + 50 * props.zoom, y: y0 },
                p2: { x: x1 - 50 * props.zoom, y: y1 },
                p3: { x: x1, y: y1 },
            })
        }
        return result
    }

    return (
        <svg
            width={`${props.window[0]}px`}
            height={`${props.window[1]}px`}
            style={{ position: "absolute", "pointer-events": "none" }}
        >
            <For each={paths()}>
                {(path) => {
                    const x0 = path.p0.x
                    const y0 = path.p0.y
                    const x1 = path.p1.x
                    const y1 = path.p1.y
                    const x2 = path.p2.x
                    const y2 = path.p2.y
                    const x3 = path.p3.x
                    const y3 = path.p3.y
                    return (
                        <>
                            <circle
                                cx={x0}
                                cy={y0}
                                r={10 * props.zoom}
                                fill="white"
                            />
                            <circle
                                cx={x3}
                                cy={y3}
                                r={10 * props.zoom}
                                fill="white"
                            />
                            <path
                                d={`M${x0},${y0} C${x1},${y1} ${x2},${y2} ${x3},${y3}`}
                                stroke="rgb(255, 255, 255)"
                                stroke-width={3 * props.zoom}
                                fill="none"
                            />
                        </>
                    )
                }}
            </For>
        </svg>
    )
}

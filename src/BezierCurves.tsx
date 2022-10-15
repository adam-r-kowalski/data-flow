import { For } from "solid-js"

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
    paths: Paths
}

export const BezierCurves = (props: Props) => {
    return (
        <svg
            width="100%"
            height="100%"
            style={{ position: "absolute", "pointer-events": "none" }}
        >
            <For each={props.paths}>
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
                            <circle cx={x0} cy={y0} r={10} fill="white" />
                            <circle cx={x3} cy={y3} r={10} fill="white" />
                            <path
                                d={`M${x0},${y0} C${x1},${y1} ${x2},${y2} ${x3},${y3}`}
                                stroke="rgb(255, 255, 255)"
                                stroke-width={3}
                                fill="none"
                            />
                        </>
                    )
                }}
            </For>
        </svg>
    )
}

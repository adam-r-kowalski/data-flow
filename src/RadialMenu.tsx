import { createSignal, Show } from "solid-js"

import { Menu } from "./menu"
import { Vec2, add } from "./vec2"

interface Props {
    menu: Menu
}

const point = (angle: number, radius: number): Vec2 => [
    Math.cos(angle) * radius,
    -Math.sin(angle) * radius,
]

export const RadialMenu = (props: Props) => {
    const ir = 50
    const or = 150
    const offset: Vec2 = [or, or]
    const translateSvg = () => {
        const [x, y] = props.menu.position()
        return `translate(${x - or}, ${y - or})`
    }
    const translateDiv = () => {
        const [x, y] = props.menu.position()
        return `translate(${x - or}px, ${y - or}px)`
    }
    const arc = (start: number, stop: number, text: string) => {
        const [fill, setFill] = createSignal("#00000033")
        const p1 = add(point(start, or), offset)
        const p2 = add(point(stop, or), offset)
        const p3 = add(point(stop, ir), offset)
        const p4 = add(point(start, ir), offset)
        const p5 = add(point((start + stop) / 2, (ir + or) / 2), offset)
        const d = () => {
            return `M ${p1[0]} ${p1[1]}
				   A ${or} ${or} 0 0 0 ${p2[0]} ${p2[1]}
				   L ${p3[0]} ${p3[1]}
				   A ${ir} ${ir} 0 0 1 ${p4[0]} ${p4[1]}`
        }
        return (
            <>
                <path
                    fill={fill()}
                    d={d()}
                    onPointerEnter={() => setFill("#00000055")}
                    onPointerLeave={() => setFill("#00000033")}
                    style={"cursor: pointer"}
                />
                <text
                    x={p5[0]}
                    y={p5[1]}
                    fill="#ffffff"
                    text-anchor="middle"
                    font-size="20"
                    font-family="sans-serif"
                    onPointerEnter={() => setFill("#00000055")}
                    style={"cursor: pointer"}
                >
                    {text}
                </text>
            </>
        )
    }

    return (
        <Show when={props.menu.visible()}>
            <>
                <div
                    style={{
                        position: "absolute",
                        transform: translateDiv(),
                        "border-radius": "50%",
                        top: "0px",
                        left: "0px",
                        width: `${or * 2}px`,
                        height: `${or * 2}px`,
                        "-webkit-backdrop-filter": "blur(12px)",
                    }}
                />
                <svg
                    style={{
                        width: "100vw",
                        height: "100vh",
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerUp={props.menu.hide}
                    onClick={props.menu.hide}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <g transform={translateSvg()}>
                        {arc(0, Math.PI / 2, "text")}
                        {arc(Math.PI / 2, Math.PI, "number")}
                        {arc(Math.PI, (3 * Math.PI) / 2, "table")}
                        {arc((3 * Math.PI) / 2, 2 * Math.PI, "plot")}
                    </g>
                </svg>
            </>
        </Show>
    )
}

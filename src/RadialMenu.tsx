import { createSignal, Show } from "solid-js"
import { styled } from "solid-styled-components"

import { Menu } from "./menu"
import { Vec2, add } from "./vec2"
import { Graph } from "./graph"
import { Camera } from "./camera"

const point = (angle: number, radius: number): Vec2 => [
    Math.cos(angle) * radius,
    -Math.sin(angle) * radius,
]

const innerRadius = 50
const outerRadius = 150

const offset: Vec2 = [outerRadius, outerRadius]

const Blur = styled("div")({
    position: "absolute",
    "border-radius": "50%",
    top: "0px",
    left: "0px",
    width: `${outerRadius * 2}px`,
    height: `${outerRadius * 2}px`,
    "-webkit-backdrop-filter": "blur(12px)",
})

const Svg = styled("svg")({
    width: "100vw",
    height: "100vh",
    position: "absolute",
    top: "0px",
    left: "0px",
})

interface Props {
    menu: Menu
    graph: Graph
    camera: Camera
}

const arc = (start: number, stop: number, text: string, props: Props) => {
    const [fill, setFill] = createSignal("#00000033")
    const p1 = add(point(start, outerRadius), offset)
    const p2 = add(point(stop, outerRadius), offset)
    const p3 = add(point(stop, innerRadius), offset)
    const p4 = add(point(start, innerRadius), offset)
    const p5 = add(
        point((start + stop) / 2, (innerRadius + outerRadius) / 2),
        offset
    )
    const d = () => {
        return `M ${p1[0]} ${p1[1]}
				   A ${outerRadius} ${outerRadius} 0 0 0 ${p2[0]} ${p2[1]}
				   L ${p3[0]} ${p3[1]}
				   A ${innerRadius} ${innerRadius} 0 0 1 ${p4[0]} ${p4[1]}`
    }
    const onClick = (e: MouseEvent) => {
        const position = props.menu.position()
        props.graph.addNode(text, props.camera.worldSpace(position))
        props.menu.hide()
        e.stopPropagation()
    }
    return (
        <>
            <path
                fill={fill()}
                d={d()}
                onPointerEnter={() => setFill("#00000055")}
                onPointerLeave={() => setFill("#00000033")}
                onClick={onClick}
                onPointerUp={onClick}
                style={"cursor: pointer"}
            />
            <text
                x={p5[0]}
                y={p5[1]}
                fill="#ffffff"
                text-anchor="middle"
                font-size="20"
                font-family="monospace"
                onPointerEnter={() => setFill("#00000055")}
                onClick={onClick}
                onPointerUp={onClick}
                style={"cursor: pointer"}
            >
                {text}
            </text>
        </>
    )
}

export const RadialMenu = (props: Props) => {
    const translateSvg = () => {
        const [x, y] = props.menu.position()
        return `translate(${x - outerRadius}, ${y - outerRadius})`
    }
    const translateDiv = () => {
        const [x, y] = props.menu.position()
        return `translate(${x - outerRadius}px, ${y - outerRadius}px)`
    }
    return (
        <Show when={props.menu.visible()}>
            <>
                <Blur style={{ transform: translateDiv() }} />
                <Svg
                    onPointerDown={(e) => e.stopPropagation()}
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={props.menu.hide}
                >
                    <g transform={translateSvg()}>
                        {arc(0, Math.PI / 2, "number", props)}
                        {arc(Math.PI / 2, Math.PI, "add", props)}
                        {arc(Math.PI, (3 * Math.PI) / 2, "sub", props)}
                        {arc((3 * Math.PI) / 2, 2 * Math.PI, "mul", props)}
                    </g>
                </Svg>
            </>
        </Show>
    )
}

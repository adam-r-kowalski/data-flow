import { createMemo } from "solid-js"
import { Vec2 } from "../../../vec2"
import { Body } from "../../graph"

const scaled = (xs: number[], from: Vec2, to: Vec2) => {
    const [minX, maxX] = from
    const [minT, maxT] = to
    return xs.map((m) => ((m - minX) / (maxX - minX)) * (maxT - minT) + minT)
}

export const LineContent = (props: { body: Body }) => {
    const to: Vec2 = [10, 290]
    const scaledX = () =>
        scaled(props.body.value.x, props.body.value.domain, to)
    const scaledY = createMemo(() =>
        scaled(props.body.value.y, props.body.value.range, to)
    )
    const d = () =>
        scaledX()
            .map((x, i) => `${i == 0 ? "M" : "L"}${x},${scaledY()[i]}`)
            .join("")
    return (
        <svg
            style={{
                width: "300px",
                height: "300px",
                background: "#24283b",
                "border-radius": "5px",
                transform: "scale(1, -1)",
            }}
        >
            <path d={d()} stroke="#bb9af7" stroke-width="2" fill="none" />
        </svg>
    )
}

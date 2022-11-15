import { createMemo } from "solid-js"
import { Vec2 } from "../../../vec2"
import { Line } from "../../value"

const scaled = (xs: number[], from: Vec2, to: Vec2) => {
    const [minX, maxX] = from
    const [minT, maxT] = to
    return xs.map((m) => ((m - minX) / (maxX - minX)) * (maxT - minT) + minT)
}

interface Props {
    value: Line
}

export const LineContent = (props: Props) => {
    const to: Vec2 = [10, 290]
    const scaledX = () => scaled(props.value.x, props.value.domain, to)
    const scaledY = createMemo(() =>
        scaled(props.value.y, props.value.range, to)
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

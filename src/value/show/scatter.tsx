import { createMemo, For } from "solid-js"

import { Body } from "../../Graph"
import { Vec2 } from "../../vec2"
import { Value } from "../value"

const scaled = (xs: number[], from: Vec2, to: Vec2) => {
    const [minX, maxX] = from
    const [minT, maxT] = to
    return xs.map((m) => ((m - minX) / (maxX - minX)) * (maxT - minT) + minT)
}

export const Scatter = (): Value => ({
    type: "Function",
    fn: (props: { body: Body }) => {
        const to: Vec2 = [10, 290]
        const scaledX = createMemo(() =>
            scaled(props.body.value.x, props.body.value.domain, to)
        )
        const scaledY = createMemo(() =>
            scaled(props.body.value.y, props.body.value.range, to)
        )
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
                <For each={scaledX()}>
                    {(x, i) => (
                        <circle
                            cx={x}
                            cy={scaledY()[i()]}
                            r={3}
                            fill="#bb9af7"
                        />
                    )}
                </For>
            </svg>
        )
    },
})

import { createMemo } from "solid-js"

import { Vec2 } from "../../../vec2"
import { Props } from "../props"
import { scaled } from "./scaled"

export const Line = (props: Props) => {
    const to: Vec2 = [10, 290]
    const scaledX = createMemo(() =>
        scaled(props.body.value.x, props.body.value.domain, to)
    )
    const scaledY = createMemo(() =>
        scaled(props.body.value.y, props.body.value.range, to)
    )
    const d = () =>
        scaledX()
            .map((x, i) => `${i == 0 ? "M" : "L"}${x},${scaledY()[i]}`)
            .join("")
    return <path d={d()} stroke="#bb9af7" stroke-width="2" fill="none" />
}

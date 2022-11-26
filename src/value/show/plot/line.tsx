import { createMemo } from "solid-js"

import { Props } from "./props"
import { scaled } from "./scaled"

export const Line = (props: Props) => {
    const scaledX = createMemo(() =>
        scaled(props.body.value.x, props.domain, props.to)
    )
    const scaledY = createMemo(() =>
        scaled(props.body.value.y, props.range, props.to)
    )
    const d = () =>
        scaledX()
            .map((x, i) => `${i == 0 ? "M" : "L"}${x},${scaledY()[i]}`)
            .join("")
    return <path d={d()} stroke="#bb9af7" stroke-width="2" fill="none" />
}

import { createMemo, For } from "solid-js"

import { Vec2 } from "../../../vec2"
import { Props } from "../props"
import { scaled } from "./scaled"

export const Scatter = (props: Props) => {
    const to: Vec2 = [10, 290]
    const scaledX = createMemo(() =>
        scaled(props.body.value.x, props.body.value.domain, to)
    )
    const scaledY = createMemo(() =>
        scaled(props.body.value.y, props.body.value.range, to)
    )
    return (
        <For each={scaledX()}>
            {(x, i) => (
                <circle cx={x} cy={scaledY()[i()]} r={3} fill="#bb9af7" />
            )}
        </For>
    )
}

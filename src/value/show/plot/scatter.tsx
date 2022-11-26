import { createMemo, For } from "solid-js"

import { Props } from "./props"
import { scaled } from "./scaled"

export const Scatter = (props: Props) => {
    const scaledX = createMemo(() =>
        scaled(props.value.x, props.domain, props.to)
    )
    const scaledY = createMemo(() =>
        scaled(props.value.y, props.range, props.to)
    )
    return (
        <For each={scaledX()}>
            {(x, i) => (
                <circle cx={x} cy={scaledY()[i()]} r={3} fill="#bb9af7" />
            )}
        </For>
    )
}

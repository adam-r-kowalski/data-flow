import { For } from "solid-js"

import { Node } from "./node"
import * as node from "./node"

export type Nodes = { [uuid: string]: Node }

interface Props {
    nodes: Nodes
    onDrag: node.OnDrag
}

export const View = (props: Props) => {
    return (
        <For each={Object.values(props.nodes)}>
            {(n) => <node.View node={n} onDrag={props.onDrag} />}
        </For>
    )
}

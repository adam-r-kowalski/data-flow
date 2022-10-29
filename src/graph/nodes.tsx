import { createEffect, JSXElement } from "solid-js"
import { usePorts } from "./ports"

interface Props {
    x: number
    y: number
    children?: JSXElement
}

export const Nodes = (props: Props) => {
    const translate = () => `translate(${props.x}px, ${props.y}px)`
    const { recreateAllRects } = usePorts()!
    createEffect(() => requestAnimationFrame(recreateAllRects))
    return <div style={{ transform: translate() }}>{props.children}</div>
}

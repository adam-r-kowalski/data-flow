import { createEffect, JSXElement } from "solid-js"
import { useCamera } from "./camera"
import { usePorts } from "./ports"

interface Props {
    children?: JSXElement
}

export const Nodes = (props: Props) => {
    const camera = useCamera()!
    const translate = () =>
        `translate(${camera().position[0]}px, ${camera().position[1]}px)`
    const scale = () => `scale(${camera().zoom}, ${camera().zoom})`
    const transform = () => `${translate()} ${scale()}`
    const { recreateAllRects } = usePorts()!
    createEffect(() => requestAnimationFrame(recreateAllRects))
    return (
        <div style={{ transform: transform(), "transform-origin": "top left" }}>
            {props.children}
        </div>
    )
}

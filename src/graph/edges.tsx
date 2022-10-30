import { JSXElement } from "solid-js"
import { useCamera } from "./camera"

interface Props {
    children?: JSXElement
}

export const Edges = (props: Props) => {
    const camera = useCamera()!
    const translate = () => `translate(${camera().x} ${camera().y})`
    const scale = () => `scale(${camera().zoom} ${camera().zoom})`
    const transform = () => `${translate()} ${scale()}`
    return (
        <svg
            style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                "pointer-events": "none",
            }}
        >
            <g transform={transform()}>{props.children}</g>
        </svg>
    )
}

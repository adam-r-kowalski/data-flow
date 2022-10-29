import { JSXElement } from "solid-js"

interface Props {
    x: number
    y: number
    children?: JSXElement
}

export const Edges = (props: Props) => {
    const translate = () => `translate(${props.x} ${props.y})`
    return (
        <svg
            style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                "pointer-events": "none",
            }}
        >
            <g transform={translate()}>{props.children}</g>
        </svg>
    )
}

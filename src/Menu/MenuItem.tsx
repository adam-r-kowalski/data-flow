import { createSignal } from "solid-js"
import { styled } from "solid-styled-components"

import { Option } from "./menu"
import { useMenu } from "./MenuProvider"

export const diameter = 44
const distance = 50
const delta = Math.PI / 3

const Circle = styled("div")({
    position: "absolute",
    color: "#ffffff",
    "-webkit-backdrop-filter": "blur(10px)",
    "backdrop-filter": "blur(10px)",
    "border-radius": "50%",
    width: `${diameter}px`,
    height: `${diameter}px`,
    display: "flex",
    "justify-content": "center",
    "align-items": "center",
    "font-size": "20px",
    cursor: "pointer",
})

interface Props {
    i: () => number
    option: Option
}

export const MenuItem = (props: Props) => {
    const menu = useMenu()!
    const theta = delta * props.i()
    const x = Math.cos(theta) * distance
    const y = Math.sin(theta) * distance
    const translate = `translate(${x}px, ${-y}px)`
    const [hover, setHover] = createSignal(false)
    return (
        <Circle
            style={{
                transform: translate,
                background: hover() ? "#000000AA" : "#00000066",
            }}
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
            onPointerUp={() => {
                props.option.onClick()
                menu.hide()
            }}
        >
            <props.option.icon />
        </Circle>
    )
}

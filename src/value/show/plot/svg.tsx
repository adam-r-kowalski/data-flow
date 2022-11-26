import { JSXElement } from "solid-js"
import { styled } from "solid-styled-components"
import { Vec2 } from "../../../vec2"

export const Container = styled("svg")({
    background: "#24283b",
    "border-radius": "5px",
    transform: "scale(1, -1)",
})

interface Props {
    size: Vec2
    children: JSXElement
}

export const Svg = (props: Props) => {
    const width = () => `${props.size[0]}px`
    const height = () => `${props.size[1]}px`
    return (
        <Container style={{ width: width(), height: height() }}>
            {props.children}
        </Container>
    )
}

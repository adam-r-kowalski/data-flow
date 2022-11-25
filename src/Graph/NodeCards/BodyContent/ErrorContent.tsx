import { styled } from "solid-styled-components"

import { Props } from "./props"

const Container = styled("div")({
    background: "#24283b",
    padding: "20px",
    "border-radius": "5px",
})

export const ErrorContent = (props: Props) => {
    return (
        <Container
            style={{
                color: "#db4b4b",
                "white-space": "pre-wrap",
                "max-width": "200px",
            }}
        >
            {props.value.message}
        </Container>
    )
}

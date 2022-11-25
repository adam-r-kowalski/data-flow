import { styled } from "solid-styled-components"

import { Body } from "../../Graph"
import { Value } from "../value"

const Container = styled("div")({
    background: "#24283b",
    padding: "20px",
    "border-radius": "5px",
})

export const Error = (): Value => ({
    type: "Function",
    fn: (props: { body: Body }) => {
        return (
            <Container
                style={{
                    color: "#db4b4b",
                    "white-space": "pre-wrap",
                    "max-width": "200px",
                }}
            >
                {props.body.value.message}
            </Container>
        )
    },
})

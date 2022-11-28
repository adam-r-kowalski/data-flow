import { styled } from "solid-styled-components"

import { Value } from "../value"
import { Props } from "./props"

const Container = styled("div")({
    background: "#24283b",
    padding: "20px",
    "border-radius": "5px",
})

export const error: Value = {
    type: "fn",
    fn: () => ({
        type: "fn",
        fn: (props: Props) => {
            return (
                <Container
                    role="note"
                    aria-label={`body ${props.node}`}
                    style={{
                        color: "#db4b4b",
                        "white-space": "pre-wrap",
                        "max-width": "200px",
                    }}
                >
                    {props.value.message}
                </Container>
            )
        },
    }),
}

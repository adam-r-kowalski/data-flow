import { styled } from "solid-styled-components"

import { Value } from "../value"
import { Props } from "./props"

const Container = styled("div")({
    background: "#24283b",
    padding: "20px",
    "border-radius": "5px",
})

export const Error: Value = {
    type: "Function",
    fn: () => ({
        type: "Function",
        fn: (props: Props) => {
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
    }),
}

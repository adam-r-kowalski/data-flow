import { styled } from "solid-styled-components"

import { UUID } from "../../graph"
import { Read } from "../../value"

const Container = styled("div")({
    background: "#24283b",
    padding: "20px 30px",
    "border-radius": "5px",
})

interface Props {
    node: UUID
    value: Read
}

export const ReadContent = (props: Props) => {
    return <Container>{props.value.name}</Container>
}

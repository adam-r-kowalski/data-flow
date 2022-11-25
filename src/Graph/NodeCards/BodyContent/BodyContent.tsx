import { styled } from "solid-styled-components"
import { JSXElement } from "solid-js"

import { Body } from "../../graph"
import { NumberContent } from "./NumberContent"
import { TensorContent } from "./TensorContent"
import { ScatterContent } from "./ScatterContent"
import { LineContent } from "./LineContent"
import { LabelContent } from "./LabelContent"
import { ReadContent } from "./ReadContent"
import { Props } from "./props"

const Container = styled("div")({
    background: "#24283b",
    padding: "20px",
    "border-radius": "5px",
})

const components: { [type: string]: (props: Props) => JSXElement } = {
    None: () => <></>,
    Number: NumberContent,
    Tensor: TensorContent,
    Scatter: ScatterContent,
    Line: LineContent,
    Label: LabelContent,
    Read: ReadContent,
    Error: (props: Props) => (
        <Container
            style={{
                color: "#db4b4b",
                "white-space": "pre-wrap",
                "max-width": "200px",
            }}
        >
            {props.value.message}
        </Container>
    ),
}

export const BodyContent = (props: { body: Body }) => {
    const Component = components[props.body.value.type]
    return (
        <Component
            node={props.body.node}
            body={props.body.id}
            value={props.body.value}
        />
    )
}

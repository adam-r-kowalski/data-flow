import { styled } from "solid-styled-components"
import { Match, Switch } from "solid-js"

import { Body } from "../../graph"
import { NumberContent } from "./NumberContent"
import { TensorContent } from "./TensorContent"
import { ScatterContent } from "./ScatterContent"
import { LineContent } from "./LineContent"
import { LabelContent } from "./LabelContent"
import { ReadContent } from "./ReadContent"

const Container = styled("div")({
    background: "#24283b",
    padding: "20px",
    "border-radius": "5px",
})

interface Props {
    body: Body
}

export const BodyContent = (props: Props) => {
    return (
        <Switch fallback={<>NOT IMPLEMENTED!</>}>
            <Match when={props.body.value.type == "None"}>
                <></>
            </Match>
            <Match when={props.body.value.type == "Number"}>
                <NumberContent
                    node={props.body.node}
                    body={props.body.id}
                    value={props.body.value}
                />
            </Match>
            <Match when={props.body.value.type == "Tensor"}>
                <TensorContent value={props.body.value} />
            </Match>
            <Match when={props.body.value.type == "Scatter"}>
                <ScatterContent value={props.body.value} />
            </Match>
            <Match when={props.body.value.type == "Line"}>
                <LineContent value={props.body.value} />
            </Match>
            <Match when={props.body.value.type == "Label"}>
                <LabelContent
                    node={props.body.node}
                    body={props.body.id}
                    value={props.body.value}
                />
            </Match>
            <Match when={props.body.value.type == "Read"}>
                <ReadContent
                    node={props.body.node}
                    body={props.body.id}
                    value={props.body.value}
                />
            </Match>
            <Match when={props.body.value.type == "Error"}>
                <Container
                    style={{
                        color: "#db4b4b",
                        "white-space": "pre-wrap",
                        "max-width": "200px",
                    }}
                >
                    {props.body.value.message}
                </Container>
            </Match>
        </Switch>
    )
}

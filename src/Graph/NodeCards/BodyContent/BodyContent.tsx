import { styled } from "solid-styled-components"
import { Match, Switch } from "solid-js"

import { Body } from "../../graph"
import { ValueKind, Number, Tensor, Error, Scatter, Line } from "../../value"
import { NumberContent } from "./NumberContent"
import { TensorContent } from "./TensorContent"
import { ScatterContent } from "./ScatterContent"
import { LineContent } from "./LineContent"

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
            <Match when={props.body.value.kind == ValueKind.NONE}>
                <></>
            </Match>
            <Match when={props.body.value.kind == ValueKind.NUMBER}>
                <NumberContent
                    node={props.body.node}
                    body={props.body.id}
                    value={props.body.value as Number}
                />
            </Match>
            <Match when={props.body.value.kind == ValueKind.TENSOR}>
                <TensorContent value={props.body.value as Tensor} />
            </Match>
            <Match when={props.body.value.kind == ValueKind.SCATTER}>
                <ScatterContent value={props.body.value as Scatter} />
            </Match>
            <Match when={props.body.value.kind == ValueKind.LINE}>
                <LineContent value={props.body.value as Line} />
            </Match>
            <Match when={props.body.value.kind == ValueKind.ERROR}>
                <Container
                    style={{
                        color: "#db4b4b",
                        "white-space": "pre-wrap",
                        "max-width": "200px",
                    }}
                >
                    {(props.body.value as Error).text}
                </Container>
            </Match>
        </Switch>
    )
}

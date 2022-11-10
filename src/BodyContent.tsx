import { Match, Switch, createSignal } from "solid-js"
import { styled } from "solid-styled-components"
import { Camera } from "./camera"

import { Body, Graph } from "./graph"
import { Positions } from "./positions"
import { Root } from "./root"
import { ValueKind, Number, Tensor } from "./value"

const Container = styled("div")({
    background: "#24283b",
    padding: "20px",
    "border-radius": "5px",
})

interface Props {
    graph: Graph
    positions: Positions
    root: Root
    camera: Camera
    body: Body
}

const canvas = document.createElement("canvas")!
const context = canvas.getContext("2d")!
context.font = "normal 20px monospace"

const NumberContent = (props: Props) => {
    const [editing, setEditing] = createSignal(false)
    let input: HTMLInputElement | undefined = undefined
    const inputString = () => (props.body.value as Number).value.toString()
    const width = () =>
        Math.floor(context.measureText(inputString()).width) + 70
    return (
        <Switch>
            <Match when={!editing()}>
                <Container
                    onClick={() => {
                        setEditing(true)
                        props.positions.retrack(props.body.node)
                        input!.value = inputString()
                        input!.focus()
                        input!.click()
                    }}
                >
                    {(props.body.value as Number).value}
                </Container>
            </Match>
            <Match when={editing()}>
                <input
                    autofocus
                    type="number"
                    step="any"
                    ref={input}
                    onPointerDown={(e) => e.stopPropagation()}
                    onInput={() => {
                        const value = {
                            kind: ValueKind.NUMBER,
                            value: parseFloat(input!.value),
                        }
                        props.graph.setValue(props.body.id, value)
                    }}
                    onBlur={() => {
                        setEditing(false)
                        props.positions.retrack(props.body.node)
                    }}
                    style={{
                        padding: "20px",
                        background: "#24283b",
                        "border-radius": "5px",
                        border: "none",
                        color: "#ffffff",
                        "font-family": "monospace",
                        "font-size": "20px",
                        width: `${width()}px`,
                    }}
                />
            </Match>
        </Switch>
    )
}

export const BodyContent = (props: Props) => {
    return (
        <Switch fallback={<>NOT IMPLEMENTED!</>}>
            <Match when={props.body.value.kind == ValueKind.NONE}>
                <></>
            </Match>
            <Match when={props.body.value.kind == ValueKind.NUMBER}>
                <NumberContent {...props} />
            </Match>
            <Match when={props.body.value.kind == ValueKind.TENSOR}>
                <Container>{(props.body.value as Tensor).value}</Container>
            </Match>
        </Switch>
    )
}

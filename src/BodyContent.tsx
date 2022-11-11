import { Match, Switch, createSignal, For } from "solid-js"
import { styled } from "solid-styled-components"
import { Camera } from "./camera"

import { Body, Graph } from "./graph"
import { Positions } from "./positions"
import { Root } from "./root"
import { ValueKind, Number, Tensor, Value, Error } from "./value"

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
                        const value: Value = {
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

const TensorContent = (props: { value: Tensor }) => {
    return (
        <Switch fallback={<>NOT IMPLEMENTED!</>}>
            <Match when={props.value.rank == 0}>
                <Container>
                    {(props.value.value as number).toFixed(2)}
                </Container>
            </Match>
            <Match when={props.value.rank == 1}>
                <div>shape {props.value.shape}</div>
                <Container style={{ display: "grid", "text-align": "end" }}>
                    <For each={(props.value.value as number[]).slice(0, 10)}>
                        {(number) => <div>{number.toFixed(2)}</div>}
                    </For>
                </Container>
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
                <TensorContent value={props.body.value as Tensor} />
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

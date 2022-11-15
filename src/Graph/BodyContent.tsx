import { styled } from "solid-styled-components"
import { Match, Switch, createSignal, For, createMemo } from "solid-js"

import { Body } from "./graph"
import { ValueKind, Number, Tensor, Value, Error, Scatter, Line } from "./value"
import { Vec2 } from "../vec2"
import { useGraph } from "./GraphProvider"
import { usePositions } from "./positions"

const Container = styled("div")({
    background: "#24283b",
    padding: "20px",
    "border-radius": "5px",
})

interface Props {
    body: Body
}

const canvas = document.createElement("canvas")!
const context = canvas.getContext("2d")!
context.font = "normal 20px monospace"

const NumberContent = (props: Props) => {
    const graph = useGraph()!
    const positions = usePositions()!
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
                        positions.retrack(props.body.node)
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
                        graph.setValue(props.body.id, value)
                    }}
                    onBlur={() => {
                        setEditing(false)
                        positions.retrack(props.body.node)
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
                <Container
                    style={{
                        display: "grid",
                        "text-align": "end",
                        overflow: "scroll",
                        "max-height": "300px",
                    }}
                    onWheel={(e) => e.stopPropagation()}
                >
                    <For each={props.value.value as number[]}>
                        {(number) => <div>{number.toFixed(2)}</div>}
                    </For>
                </Container>
            </Match>
        </Switch>
    )
}

const scaled = (xs: number[], from: Vec2, to: Vec2) => {
    const [minX, maxX] = from
    const [minT, maxT] = to
    return xs.map((m) => ((m - minX) / (maxX - minX)) * (maxT - minT) + minT)
}

const ScatterContent = (props: { value: Scatter }) => {
    const to: Vec2 = [10, 290]
    const scaledX = createMemo(() =>
        scaled(props.value.x, props.value.domain, to)
    )
    const scaledY = createMemo(() =>
        scaled(props.value.y, props.value.range, to)
    )
    return (
        <svg
            style={{
                width: "300px",
                height: "300px",
                background: "#24283b",
                "border-radius": "5px",
                transform: "scale(1, -1)",
            }}
        >
            <For each={scaledX()}>
                {(x, i) => (
                    <circle cx={x} cy={scaledY()[i()]} r={3} fill="#bb9af7" />
                )}
            </For>
        </svg>
    )
}

const LineContent = (props: { value: Line }) => {
    const to: Vec2 = [10, 290]
    const scaledX = () => scaled(props.value.x, props.value.domain, to)
    const scaledY = createMemo(() =>
        scaled(props.value.y, props.value.range, to)
    )
    const d = () =>
        scaledX()
            .map((x, i) => `${i == 0 ? "M" : "L"}${x},${scaledY()[i]}`)
            .join("")
    return (
        <svg
            style={{
                width: "300px",
                height: "300px",
                background: "#24283b",
                "border-radius": "5px",
                transform: "scale(1, -1)",
            }}
        >
            <path d={d()} stroke="#bb9af7" stroke-width="2" fill="none" />
        </svg>
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

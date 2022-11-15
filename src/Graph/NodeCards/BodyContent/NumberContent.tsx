import { createSignal, Match, Switch } from "solid-js"
import { styled } from "solid-styled-components"

import { useMeasureText } from "../../../MeasureText"
import { UUID } from "../../graph"
import { useGraph } from "../../GraphProvider"
import { usePositions } from "../../positions"
import { Number, Value, ValueKind } from "../../value"

const Container = styled("div")({
    background: "#24283b",
    padding: "20px",
    "border-radius": "5px",
})

interface Props {
    node: UUID
    body: UUID
    value: Number
}

export const NumberContent = (props: Props) => {
    const graph = useGraph()!
    const positions = usePositions()!
    const measureText = useMeasureText()!
    const [editing, setEditing] = createSignal(false)
    let input: HTMLInputElement | undefined = undefined
    const inputString = () => props.value.value.toString()
    const font = "normal 20px monospace"
    const width = () => Math.floor(measureText.width(font, inputString())) + 70
    return (
        <Switch>
            <Match when={!editing()}>
                <Container
                    onClick={() => {
                        setEditing(true)
                        positions.retrack(props.node)
                        input!.value = inputString()
                        input!.focus()
                        input!.click()
                    }}
                >
                    {props.value.value}
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
                        graph.setValue(props.body, value)
                    }}
                    onBlur={() => {
                        setEditing(false)
                        positions.retrack(props.node)
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

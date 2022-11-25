import { createSignal, Match, Switch } from "solid-js"
import { styled } from "solid-styled-components"

import { useMeasureText } from "../../../MeasureText"
import { Value } from "../../../value"
import { useGraph } from "../../GraphProvider"
import { usePositions } from "../../positions"
import { Props } from "./props"

const Container = styled("div")({
    background: "#24283b",
    padding: "20px 30px",
    "border-radius": "5px",
})

export const ReadContent = (props: Props) => {
    const graph = useGraph()!
    const positions = usePositions()!
    const measureText = useMeasureText()!
    const [editing, setEditing] = createSignal(false)
    let input: HTMLInputElement | undefined = undefined
    const font = "normal 20px monospace"
    const width = () =>
        Math.floor(measureText.width(font, props.value.name)) + 70
    return (
        <Switch>
            <Match when={!editing()}>
                <Container
                    onClick={() => {
                        setEditing(true)
                        positions.retrack(props.node)
                        input!.value = props.value.name
                        input!.focus()
                        input!.click()
                    }}
                >
                    {props.value.name}
                </Container>
            </Match>
            <Match when={editing()}>
                <input
                    ref={input}
                    onPointerDown={(e) => e.stopPropagation()}
                    onInput={() => {
                        const value: Value = {
                            type: "Read",
                            name: input!.value,
                        }
                        graph.untrackLabel(props.node, props.value.name)
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

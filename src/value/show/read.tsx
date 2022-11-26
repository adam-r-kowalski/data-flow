import { createSignal, Match, Switch } from "solid-js"
import { styled } from "solid-styled-components"

import { useGraph } from "../../Graph"
import { usePositions } from "../../Graph/positions"
import { useMeasureText } from "../../MeasureText"
import { Value } from "../value"
import { Props } from "./props"

const Container = styled("div")({
    background: "#24283b",
    padding: "20px 30px",
    "border-radius": "5px",
})

export const Read: Value = {
    type: "Function",
    fn: () => ({
        type: "Function",
        fn: (props: Props) => {
            const graph = useGraph()!
            const positions = usePositions()!
            const measureText = useMeasureText()!
            const [editing, setEditing] = createSignal(false)
            let input: HTMLInputElement | undefined = undefined
            const font = "normal 20px monospace"
            const width = () =>
                Math.floor(measureText.width(font, props.body.value.name)) + 70
            return (
                <Switch>
                    <Match when={!editing()}>
                        <Container
                            onClick={() => {
                                setEditing(true)
                                positions.retrack(props.body.node)
                                input!.value = props.body.value.name
                                input!.focus()
                                input!.click()
                            }}
                        >
                            {props.body.value.name}
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
                                graph.untrackLabel(
                                    props.body.node,
                                    props.body.value.name
                                )
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
        },
    }),
}

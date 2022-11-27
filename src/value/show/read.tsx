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

export const read: Value = {
    type: "fn",
    fn: () => ({
        type: "fn",
        fn: (props: Props) => {
            const graph = useGraph()!
            const positions = usePositions()!
            const measureText = useMeasureText()!
            const [editing, setEditing] = createSignal(false)
            let input: HTMLInputElement | undefined = undefined
            const font = "normal 20px monospace"
            const width = () =>
                Math.floor(
                    measureText.width(font, props.node.output.value.name)
                ) + 70
            return (
                <Switch>
                    <Match when={!editing()}>
                        <Container
                            onClick={() => {
                                setEditing(true)
                                positions.retrack(props.node.id)
                                input!.value = props.node.output.value.name
                                input!.focus()
                                input!.click()
                            }}
                        >
                            {props.node.output.value.name}
                        </Container>
                    </Match>
                    <Match when={editing()}>
                        <input
                            ref={input}
                            onPointerDown={(e) => e.stopPropagation()}
                            onInput={() => {
                                const value: Value = {
                                    type: "read",
                                    name: input!.value,
                                }
                                graph.untrackLabel(
                                    props.node.id,
                                    props.node.output.value.name
                                )
                                graph.setValue(props.node.id, value)
                            }}
                            onBlur={() => {
                                setEditing(false)
                                positions.retrack(props.node.id)
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

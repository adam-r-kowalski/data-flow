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

export const num: Value = {
    type: "fn",
    fn: () => ({
        type: "fn",
        fn: (props: Props) => {
            const graph = useGraph()!
            const positions = usePositions()!
            const measureText = useMeasureText()!
            const [editing, setEditing] = createSignal(false)
            let input: HTMLInputElement | undefined = undefined
            const inputString = () => props.value.data.toString()
            const font = "normal 20px monospace"
            const width = () =>
                Math.floor(measureText.width(font, inputString())) + 70
            return (
                <Switch>
                    <Match when={!editing()}>
                        <Container
                            role="button"
                            aria-label={`body ${props.node}`}
                            onClick={() => {
                                setEditing(true)
                                positions.retrack(props.node)
                                input!.value = inputString()
                                input!.focus()
                                input!.click()
                            }}
                        >
                            {props.value.data}
                        </Container>
                    </Match>
                    <Match when={editing()}>
                        <input
                            type="number"
                            aria-label={`body ${props.node}`}
                            step="any"
                            ref={input}
                            onPointerDown={(e) => e.stopPropagation()}
                            onInput={() => {
                                const value: Value = {
                                    type: "num",
                                    data: input!.valueAsNumber,
                                }
                                graph.setValue(props.node, value)
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
        },
    }),
}

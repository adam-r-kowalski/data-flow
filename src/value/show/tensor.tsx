import { For, Match, Switch } from "solid-js"
import { styled } from "solid-styled-components"
import { Body } from "../../graph"
import { Value } from "../value"

const Container = styled("div")({
    background: "#24283b",
    padding: "20px",
    "border-radius": "5px",
})

export const Tensor = (): Value => ({
    type: "Function",
    fn: (props: { body: Body }) => {
        return (
            <Switch fallback={<>NOT IMPLEMENTED!</>}>
                <Match when={props.body.value.rank == 0}>
                    <Container>
                        {(props.body.value.data as number).toFixed(2)}
                    </Container>
                </Match>
                <Match when={props.body.value.rank == 1}>
                    <Container
                        style={{
                            display: "grid",
                            "text-align": "end",
                            overflow: "scroll",
                            "max-height": "300px",
                        }}
                        onWheel={(e) => {
                            e.currentTarget.scrollTop += e.deltaY
                            e.stopPropagation()
                            e.preventDefault()
                        }}
                    >
                        <For each={props.body.value.data as number[]}>
                            {(number) => <div>{number.toFixed(2)}</div>}
                        </For>
                    </Container>
                </Match>
            </Switch>
        )
    },
})

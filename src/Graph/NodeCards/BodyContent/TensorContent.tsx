import { For, Match, Switch } from "solid-js"
import { styled } from "solid-styled-components"
import { Value } from "../../../value"

const Container = styled("div")({
    background: "#24283b",
    padding: "20px",
    "border-radius": "5px",
})

interface Props {
    value: Value
}

export const TensorContent = (props: Props) => {
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
                    onWheel={(e) => {
                        e.currentTarget.scrollTop += e.deltaY
                        e.stopPropagation()
                        e.preventDefault()
                    }}
                >
                    <For each={props.value.value as number[]}>
                        {(number) => <div>{number.toFixed(2)}</div>}
                    </For>
                </Container>
            </Match>
        </Switch>
    )
}

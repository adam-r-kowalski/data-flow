import { For, Match, Switch } from "solid-js"
import { Value } from "../../value"
import { Line } from "./line"
import { Props } from "./props"
import { Scatter } from "./scatter"

export const Overlay = (props: Props) => {
    return (
        <For each={props.value.plots}>
            {(plot: Value) => {
                return (
                    <Switch>
                        <Match when={plot.type == "Scatter"}>
                            <Scatter
                                value={plot}
                                domain={props.domain}
                                range={props.range}
                                to={props.to}
                            />
                        </Match>
                        <Match when={plot.type == "Line"}>
                            <Line
                                value={plot}
                                domain={props.domain}
                                range={props.range}
                                to={props.to}
                            />
                        </Match>
                    </Switch>
                )
            }}
        </For>
    )
}

import { JSXElement } from "solid-js"
import { Value } from "../../value"
import { Props } from "../props"
import { Line } from "./line"
import { Scatter } from "./scatter"
import { Svg } from "./svg"

export const Plot = (Component: (props: Props) => JSXElement): Value => ({
    type: "Function",
    fn: () => ({
        type: "Function",
        fn: (props: Props) => (
            <Svg>
                <Component body={props.body} />
            </Svg>
        ),
    }),
})

export const plot = {
    Scatter: Plot(Scatter),
    Line: Plot(Line),
}

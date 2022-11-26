import { JSXElement } from "solid-js"
import { Value } from "../../value"
import { Props } from "./props"
import { Line } from "./line"
import { Scatter } from "./scatter"
import { Svg } from "./svg"
import { Vec2 } from "../../../vec2"

export const Plot = (Component: (props: Props) => JSXElement): Value => ({
    type: "Function",
    fn: () => ({
        type: "Function",
        fn: (props: Props) => {
            const size: Vec2 = [300, 300]
            const to: Vec2 = [10, 290]
            return (
                <Svg size={size}>
                    <Component
                        body={props.body}
                        domain={props.body.value.domain}
                        range={props.body.value.range}
                        to={to}
                    />
                </Svg>
            )
        },
    }),
})

export const plot = {
    Scatter: Plot(Scatter),
    Line: Plot(Line),
}

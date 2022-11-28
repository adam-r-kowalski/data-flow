import { JSXElement } from "solid-js"

import { Value } from "../../value"
import { Props } from "./props"
import { Line } from "./line"
import { Scatter } from "./scatter"
import { Svg } from "./svg"
import { Vec2 } from "../../../vec2"
import { Overlay } from "./overlay"
import { UUID } from "../../../Graph/graph"

export const Plot = (Component: (props: Props) => JSXElement): Value => ({
    type: "fn",
    fn: () => ({
        type: "fn",
        fn: (props: { node: UUID; value: Value }) => {
            const size: Vec2 = [300, 300]
            const to: Vec2 = [10, 290]
            return (
                <Svg size={size}>
                    <Component
                        value={props.value}
                        domain={props.value.domain}
                        range={props.value.range}
                        to={to}
                    />
                </Svg>
            )
        },
    }),
})

export const plot = {
    scatter: Plot(Scatter),
    line: Plot(Line),
    overlay: Plot(Overlay),
}

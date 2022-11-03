import { JSX } from "solid-js/jsx-runtime"
import { Ports } from "./edge"

interface Props extends JSX.LineSVGAttributes<SVGLineElement> {
    ports: () => Ports
}

export const Line = (props: Props) => (
    <line
        stroke-width={2}
        stroke="black"
        {...props}
        x1={props.ports().from.center[0]}
        y1={props.ports().from.center[1]}
        x2={props.ports().to.center[0]}
        y2={props.ports().to.center[1]}
    />
)

import { JSX } from "solid-js/jsx-runtime"
import { Ports } from "./edge"

interface Props extends JSX.PathSVGAttributes<SVGPathElement> {
    ports: () => Ports
}

export const Curve = (props: Props) => {
    const d = () => {
        const [x0, y0] = props.ports().from.center
        const [x3, y3] = props.ports().to.center
        const right = x0 < x3
        const delta = Math.min(Math.abs(x3 - x0), 50)
        const x1 = right ? x0 + delta : x0 - delta
        const x2 = right ? x3 - delta : x3 + delta
        const y1 = y0
        const y2 = y3
        return `M${x0},${y0} C${x1},${y1} ${x2},${y2} ${x3},${y3}`
    }
    return (
        <path fill="none" stroke="black" stroke-width="2" {...props} d={d()} />
    )
}

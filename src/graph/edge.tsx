import { JSXElement } from "solid-js"
import { Rect, usePorts } from "./ports"
import { Vec2, add, scale } from "./vec2"

interface Port {
    position: Vec2
    size: Vec2
    center: Vec2
}

export interface Ports {
    from: Port
    to: Port
}

interface Props {
    from: string
    to: string
    children: (ports: () => Ports) => JSXElement
}

const transform = ({ position, size }: Rect): Port => {
    return {
        position,
        size,
        center: add(position, scale(size, 1 / 2)),
    }
}

const empty: Rect = {
    position: [0, 0],
    size: [0, 0],
}

export const Edge = (props: Props) => {
    const { ports } = usePorts()!
    const port_data = (): Ports => {
        return {
            from: transform(ports[props.from] ?? empty),
            to: transform(ports[props.to] ?? empty),
        }
    }
    return props.children(port_data)
}

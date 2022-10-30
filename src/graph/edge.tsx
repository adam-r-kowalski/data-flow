import { JSXElement } from "solid-js"
import { Rect, usePorts } from "./ports"

interface Port {
    x: number
    y: number
    width: number
    height: number
	cx: number
	cy: number
}

interface Ports {
	from: Port
	to: Port
}

interface Props {
    from: string
    to: string
    children: (ports: () => Ports) => JSXElement
}

export const Edge = (props: Props) => {
    const { ports, root } = usePorts()!
    const port_data = (): Ports => {
        const { x: rx, y: ry } = root()!.getBoundingClientRect()
        const transform = ({ x, y, width, height }: Rect): Port => {
		const ox = x - rx
		const oy = y - ry
			return {
				x: ox,
				y: oy,
				width,
				height,
				cx: ox + width / 2,
				cy: oy + height / 2,
			}
        }
        return {from: transform(ports[props.from]), to: transform(ports[props.to])}
    }
    return props.children(port_data)
}

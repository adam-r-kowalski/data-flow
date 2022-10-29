import { JSXElement } from "solid-js"
import { usePorts } from "./ports"

interface Rect {
    x: number
    y: number
    width: number
    height: number
}

type Rects = [Rect, Rect]

interface Props {
    from: string
    to: string
    children: (rects: () => Rects) => JSXElement
}

export const Edge = (props: Props) => {
    const { ports, root } = usePorts()!
    const rects = (): Rects => {
        const { x: rx, y: ry } = root()!.getBoundingClientRect()
        const offset = ({ x, y, width, height }: Rect): Rect => ({
            x: x - rx,
            y: y - ry,
            width,
            height,
        })
        const fromRect = offset(ports[props.from])
        const toRect = offset(ports[props.to])
        return [fromRect, toRect]
    }
    return props.children(rects)
}

import { Show } from "solid-js"

import { Menu } from "./menu"

export const RadialMenu = (props: Props) => {
    const translateSvg = () => {
        const [x, y] = props.menu.position()
        return `translate(${x - outerRadius}, ${y - outerRadius})`
    }
    const translateDiv = () => {
        const [x, y] = props.menu.position()
        return `translate(${x - outerRadius}px, ${y - outerRadius}px)`
    }
    return (
        <Show when={props.menu.visible()}>
            <>
                <Blur style={{ transform: translateDiv() }} />
                <Svg
                    onPointerDown={(e) => e.stopPropagation()}
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={props.menu.hide}
                >
                    <g transform={translateSvg()}>
                        {arc(0, Math.PI / 2, "number", props)}
                        {arc(Math.PI / 2, Math.PI, "add", props)}
                        {arc(Math.PI, (3 * Math.PI) / 2, "sub", props)}
                        {arc((3 * Math.PI) / 2, 2 * Math.PI, "mul", props)}
                    </g>
                </Svg>
            </>
        </Show>
    )
}
